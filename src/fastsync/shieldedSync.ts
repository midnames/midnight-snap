// Shielded sync with a viewing key. The stock sync replays all zswap events of the chain. This sync
// sends the viewing key to the indexer (`connect`) and receives only this wallet's transactions, each
// with a collapsed update for the gap before it. The events go through the SDK's own
// `CoreWallet.replayEventsWithChanges`.
// The indexer can then read all shielded history of the wallet. Use only with the user's consent.
import * as ledger from "@midnightntwrk/ledger-v9";
import { ShieldedEncryptionSecretKey } from "@midnightntwrk/wallet-sdk-address-format";
import { CoreWallet, Sync, WalletError } from "@midnightntwrk/wallet-sdk-shielded/v1";
import { Effect, Stream } from "effect";
import { hexToBytes } from "./dustQueries.ts";
import { makeHttp, makeSocket, wsUrlFor, type IndexerSocket } from "./indexerClient.ts";

const { SyncWalletError } = WalletError;

export interface CollapsedUpdate {
  readonly startIndex: number;
  readonly endIndex: number;
  /** Hex-encoded `ledger.MerkleTreeCollapsedUpdate`. */
  readonly update: string;
  readonly protocolVersion: number;
}

export interface LedgerEventPayload {
  readonly id: number;
  readonly raw: string;
  readonly maxId: number;
  readonly protocolVersion: number;
}

const COLLAPSED_UPDATE_FIELDS = "startIndex endIndex update protocolVersion";

/** Registers the viewing key and returns a session id. `options.startIndex` limits the indexer's scan. */
const CONNECT = `
  mutation FastSyncConnect($viewingKey: ViewingKey!, $options: ConnectOptions) {
    connect(viewingKey: $viewingKey, options: $options)
  }`;

const SHIELDED_TRANSACTIONS = `
  subscription FastSyncShieldedTransactions($sessionId: HexEncoded!, $index: Int) {
    shieldedTransactions(sessionId: $sessionId, index: $index) {
      __typename
      ... on ShieldedTransactionsProgress {
        highestZswapEndIndex
        highestCheckedZswapEndIndex
        highestRelevantZswapEndIndex
      }
      ... on RelevantTransaction {
        transaction {
          id
          hash
          protocolVersion
          zswapStartIndex
          zswapEndIndex
          transactionResult { status segments { id success } }
          zswapLedgerEvents { id raw maxId protocolVersion }
        }
        zswapCollapsedUpdate { ${COLLAPSED_UPDATE_FIELDS} }
      }
    }
  }`;

const ZSWAP_COLLAPSED_UPDATE = `
  query FastSyncZswapCollapsedUpdate($startIndex: Int!, $endIndex: Int!) {
    zswapMerkleTreeCollapsedUpdate(startIndex: $startIndex, endIndex: $endIndex) {
      ${COLLAPSED_UPDATE_FIELDS}
    }
  }`;

interface RelevantTransactionPayload {
  readonly __typename: "RelevantTransaction";
  readonly transaction: {
    readonly protocolVersion: number;
    readonly zswapStartIndex: number;
    readonly zswapEndIndex: number;
    readonly zswapLedgerEvents: ReadonlyArray<LedgerEventPayload>;
  };
  readonly zswapCollapsedUpdate: CollapsedUpdate | null;
}

interface ShieldedProgressPayload {
  readonly __typename: "ShieldedTransactionsProgress";
  readonly highestZswapEndIndex: number;
}

type ShieldedTransactionsPayload = { readonly shieldedTransactions: RelevantTransactionPayload | ShieldedProgressPayload };

export type ShieldedFastSyncConfiguration = Sync.DefaultSyncConfiguration & {
  readonly networkId: string;
  /** Limits the indexer's scan. Safe only if the wallet had no shielded coins before this zswap index. */
  readonly connectStartIndex?: number | undefined;
};

export type ShieldedFastSyncUpdate = ShieldedFastSyncCollapse | { readonly _tag: "Events"; readonly inner: Sync.WalletSyncUpdate };

export type ShieldedFastSyncCollapse = {
  readonly _tag: "Collapse";
  /** Collapsed update for the gap before the transaction, if the server sent one. */
  readonly collapsedUpdate: CollapsedUpdate | null;
  /** Zswap ledger events in chain order. Empty when only the tree moves forward. */
  readonly events: ReadonlyArray<LedgerEventPayload>;
  readonly highestZswapEndIndex: bigint;
  /** The local tree index after this update. */
  readonly appliedIndex: bigint;
  readonly protocolVersion: number;
  readonly secretKeys: ledger.ZswapSecretKeys;
};

const syncError = (message: string, cause?: unknown) => new SyncWalletError({ message, cause });

/**
 * Inclusive collapse range from `firstFree` to a chain frontier `highest`. Both values are exclusive
 * (leaf counts). One more leaf breaks all Merkle paths. Returns null when the wallet is at the frontier.
 */
export const tailCollapseRange = (firstFree: bigint, highest: bigint): { startIndex: number; endIndex: number } | null =>
  firstFree >= highest ? null : { startIndex: Number(firstFree), endIndex: Number(highest - 1n) };

/** The bech32m viewing key for the indexer `connect` mutation. */
export const viewingKeyFor = (secretKeys: ledger.ZswapSecretKeys, networkId: string): string =>
  ShieldedEncryptionSecretKey.codec.encode(networkId, new ShieldedEncryptionSecretKey(secretKeys.encryptionSecretKey)).asString();

export const makeShieldedFastSyncService = (
  config: ShieldedFastSyncConfiguration,
): Sync.SyncService<CoreWallet, ledger.ZswapSecretKeys, ShieldedFastSyncUpdate> => {
  const { indexerClientConnection } = config;
  const httpUrl = indexerClientConnection.indexerHttpUrl;
  // If the fast path fails, use the stock sync. Without this a failed `connect` retries forever and
  // stops the other wallets in the facade. Only from an empty state: the offsets of the two syncs differ.
  const fallback = Sync.makeEventsSyncService(config);

  async function* fastUpdates(state: CoreWallet, secretKeys: ledger.ZswapSecretKeys, socket: IndexerSocket): AsyncGenerator<ShieldedFastSyncUpdate> {
    const http = makeHttp(httpUrl);
    const session = await http.query<{ connect: string }>(CONNECT, {
      viewingKey: viewingKeyFor(secretKeys, config.networkId),
      options: config.connectStartIndex === undefined ? undefined : { startIndex: config.connectStartIndex },
    });

    // Start from the wallet's own `firstFree`. The server cursor and `firstFree` then move together,
    // so each attached collapsed update covers the gap that the wallet needs.
    const startIndex = state.state.firstFree;
    let cursor = startIndex;

    for await (const payload of socket.subscribe<ShieldedTransactionsPayload>(SHIELDED_TRANSACTIONS, { sessionId: session.connect, index: Number(startIndex) })) {
      const event = payload.shieldedTransactions;

      if (event.__typename === "RelevantTransaction") {
        const { transaction } = event;
        cursor = BigInt(transaction.zswapEndIndex); // Exclusive: the next free index.
        yield {
          _tag: "Collapse",
          collapsedUpdate: event.zswapCollapsedUpdate,
          events: transaction.zswapLedgerEvents,
          highestZswapEndIndex: cursor, // A transaction has no tip value. Use the wallet position, so progress does not stop.
          appliedIndex: cursor,
          protocolVersion: transaction.protocolVersion,
          secretKeys,
        };
        continue;
      }

      // A progress event has no collapsed update. Fetch the range to the tip.
      const highest = BigInt(event.highestZswapEndIndex);
      const range = tailCollapseRange(cursor, highest);
      if (range === null) {
        yield { _tag: "Collapse", collapsedUpdate: null, events: [], highestZswapEndIndex: highest, appliedIndex: cursor, protocolVersion: 0, secretKeys };
        continue;
      }

      const tail = await http.query<{ zswapMerkleTreeCollapsedUpdate: CollapsedUpdate | null }>(ZSWAP_COLLAPSED_UPDATE, range);
      cursor = highest;
      yield {
        _tag: "Collapse",
        collapsedUpdate: tail.zswapMerkleTreeCollapsedUpdate,
        events: [],
        highestZswapEndIndex: highest,
        appliedIndex: highest,
        protocolVersion: tail.zswapMerkleTreeCollapsedUpdate?.protocolVersion ?? 0,
        secretKeys,
      };
    }
  }

  return {
    updates: (state, secretKeys) => {
      let applied = 0;
      const fastPath = Stream.unwrapScoped(
        Effect.acquireRelease(
          Effect.sync(() => makeSocket(indexerClientConnection.indexerWsUrl ?? wsUrlFor(httpUrl))),
          (socket) => Effect.sync(() => socket.close()),
        ).pipe(
          Effect.map((socket) => {
            const updates = fastUpdates(state, secretKeys, socket);
            const count = (r: IteratorResult<ShieldedFastSyncUpdate>) => {
              if (!r.done) applied++;
              return r;
            };
            // The stream stops with `return`, and a generator runs `return` only after its pending `next`, which waits
            // for the indexer's next message (up to 30 s). Closing the socket first ends the pending `next` at once.
            const stoppable: AsyncIterable<ShieldedFastSyncUpdate> = {
              [Symbol.asyncIterator]: () => ({
                next: () => updates.next().then(count),
                return: (value?: unknown) => {
                  socket.close();
                  return updates.return(value as undefined);
                },
              }),
            };
            return Stream.fromAsyncIterable(stoppable, (cause) => syncError("Shielded fast sync failed", cause));
          }),
        ),
      );
      return fastPath.pipe(
        Stream.catchAll((error) =>
          applied === 0 && (state.progress?.appliedIndex ?? 0n) === 0n
            ? fallback.updates(state, secretKeys).pipe(Stream.map((inner) => ({ _tag: "Events", inner }) as const))
            : Stream.fromEffect(Effect.logWarning("shielded fast sync failed", error)).pipe(Stream.drain),
        ),
      );
    },
  };
};

export const makeShieldedFastSyncCapability = (): Sync.SyncCapability<CoreWallet, ShieldedFastSyncUpdate, Sync.ChangesResult> => {
  const fallback = Sync.makeEventsSyncCapability();

  return {
    applyUpdate: (state, update) => {
      if (update._tag === "Events") return fallback.applyUpdate(state, update.inner);

      let next = state;
      // Apply the collapsed update first: it fills the indices before the transaction's commitments.
      if (update.collapsedUpdate !== null) {
        next = CoreWallet.applyCollapsedUpdate(next, ledger.MerkleTreeCollapsedUpdate.deserialize(hexToBytes(update.collapsedUpdate.update)));
      }

      let changes: ledger.ZswapStateChanges[] = [];
      if (update.events.length > 0) {
        const events = update.events.map((e) => ledger.Event.deserialize(hexToBytes(e.raw)));
        [next, changes] = CoreWallet.replayEventsWithChanges(next, update.secretKeys, events);
      }

      const updated = CoreWallet.updateProgress(next, {
        appliedIndex: update.appliedIndex,
        highestIndex: update.highestZswapEndIndex,
        highestRelevantIndex: update.highestZswapEndIndex,
        highestRelevantWalletIndex: update.highestZswapEndIndex,
        isConnected: true,
      });

      return [updated, { changes, protocolVersion: update.protocolVersion === 0 ? Number(state.protocolVersion) : update.protocolVersion }];
    },
  };
};
