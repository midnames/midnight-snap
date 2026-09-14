// Dust sync service with two fast paths over the SDK's stock sync:
// - catch-up: a saved state with an anchor is brought up to date (dustCatchUp.ts).
// - origin: a new account skips history. Both dust trees move to the origin with one collapsed
//   update each, then the stock sync replays the events after the origin.
// If a fast path fails, the stock sync runs. The stock sync is slower but always correct.
import * as ledger from "@midnightntwrk/ledger-v9";
import { CoreWallet, SyncService, WalletError } from "@midnightntwrk/wallet-sdk-dust-wallet/v1";
import { Effect, Stream, type Scope } from "effect";
import { catchUpDustState, type DustCatchUpAnchor } from "./dustCatchUp.ts";
import { collapsedUpdate, hexToBytes } from "./dustQueries.ts";
import { makeHttp, makeSocket, wsUrlFor } from "./indexerClient.ts";

const { SyncWalletError } = WalletError;

/** Where a new account starts. See `WalletSyncOrigin` in syncOrigin.ts. */
export interface DustSyncOrigin {
  /** Generation tree frontier (leaf count). */
  readonly generationIndex: number;
  /** Commitment tree frontier (leaf count). */
  readonly commitmentIndex: number;
  /** Replay starts after this dust ledger event id. */
  readonly ledgerEventId: number;
}

export interface DustCatchUpConfiguration {
  readonly anchor: DustCatchUpAnchor;
  /** Bech32m dust address. Catch-up needs no viewing key. */
  readonly dustAddress: string;
  readonly onResult?: (result: {
    readonly anchor: DustCatchUpAnchor;
    readonly spendsApplied: number;
    readonly generationsAdded: number;
    readonly roundTrips: number;
    readonly elapsedMs: number;
  }) => void;
}

export type DustFastSyncConfiguration = SyncService.DefaultSyncConfiguration & {
  readonly origin?: DustSyncOrigin | null | undefined;
  readonly catchUp?: DustCatchUpConfiguration | null | undefined;
};

export type DustFastSyncUpdate =
  | { readonly _tag: "Collapse"; readonly generationUpdate: string | null; readonly commitmentUpdate: string | null; readonly appliedIndex: bigint }
  | { readonly _tag: "CaughtUp"; readonly serializedState: Uint8Array; readonly appliedIndex: bigint }
  | { readonly _tag: "Events"; readonly inner: SyncService.WalletSyncUpdate };

const syncError = (message: string, cause?: unknown) => new SyncWalletError({ message, cause });

/** Inclusive collapse range for `[0, frontier - 1]`. The frontier is exclusive. One more leaf breaks all Merkle paths. */
export const originCollapseRange = (frontier: number): { startIndex: number; endIndex: number } | null =>
  frontier <= 0 ? null : { startIndex: 0, endIndex: frontier - 1 };

export const makeDustFastSyncService = (
  config: DustFastSyncConfiguration,
): SyncService.SyncService<CoreWallet, ledger.DustSecretKey, DustFastSyncUpdate> => {
  const fallback = SyncService.makeDefaultSyncService(config);
  const httpUrl = config.indexerClientConnection.indexerHttpUrl;

  const asEvents = (stream: Stream.Stream<SyncService.WalletSyncUpdate, WalletError.WalletError, Scope.Scope>) =>
    stream.pipe(Stream.map((inner) => ({ _tag: "Events", inner }) as const));

  return {
    blockData: fallback.blockData,

    updates: (state, secretKey) => {
      const origin = config.origin ?? null;
      const catchUp = config.catchUp ?? null;

      if (catchUp && state.progress.appliedIndex > 0n) {
        const caughtUp = Effect.gen(function* () {
          const http = makeHttp(httpUrl);
          const socket = makeSocket(config.indexerClientConnection.indexerWsUrl ?? wsUrlFor(httpUrl));
          const startedAt = Date.now();
          const result = yield* Effect.tryPromise({
            try: () => catchUpDustState({ http, socket }, state.state, catchUp.anchor, catchUp.dustAddress, secretKey).finally(() => socket.close()),
            catch: (cause) => syncError("Dust catch-up failed", cause),
          });
          catchUp.onResult?.({
            anchor: result.anchor,
            spendsApplied: result.spendsApplied,
            generationsAdded: result.generationsAdded,
            roundTrips: result.roundTrips,
            elapsedMs: Date.now() - startedAt,
          });
          return {
            _tag: "CaughtUp",
            serializedState: result.state.serialize(),
            // Continue from the alignment point. A replay from the saved offset adds events two times, and the ledger refuses them.
            appliedIndex: result.resumeEventId > 0 ? BigInt(result.resumeEventId) : state.progress.appliedIndex,
          } as const;
        });

        return Stream.unwrap(
          caughtUp.pipe(
            Effect.map((update) =>
              Stream.concat(
                Stream.make(update as DustFastSyncUpdate),
                asEvents(fallback.updates({ ...state, progress: { ...state.progress, appliedIndex: update.appliedIndex } }, secretKey)),
              ),
            ),
            Effect.catchAll(() => Effect.succeed(asEvents(fallback.updates(state, secretKey)))),
          ),
        );
      }

      // No origin, or the wallet already applied events: history cannot be skipped.
      if (origin === null || state.progress.appliedIndex > 0n) return asEvents(fallback.updates(state, secretKey));

      const collapse = Effect.tryPromise({
        try: async () => {
          const http = makeHttp(httpUrl);
          const genRange = originCollapseRange(origin.generationIndex);
          const commitRange = originCollapseRange(origin.commitmentIndex);
          return {
            _tag: "Collapse",
            generationUpdate: genRange ? await collapsedUpdate(http, "dustGenerationMerkleTreeUpdate", genRange.startIndex, genRange.endIndex) : null,
            commitmentUpdate: commitRange ? await collapsedUpdate(http, "dustCommitmentMerkleTreeUpdate", commitRange.startIndex, commitRange.endIndex) : null,
            appliedIndex: BigInt(origin.ledgerEventId),
          } as const;
        },
        catch: (cause) => syncError("Could not fetch dust origin collapsed updates", cause),
      });

      const seeded: CoreWallet = { ...state, progress: { ...state.progress, appliedIndex: BigInt(origin.ledgerEventId) } };

      return Stream.unwrap(
        collapse.pipe(
          Effect.map((update) => Stream.concat(Stream.make(update as DustFastSyncUpdate), asEvents(fallback.updates(seeded, secretKey)))),
          Effect.catchAll(() => Effect.succeed(asEvents(fallback.updates(state, secretKey)))),
        ),
      );
    },
  };
};

export const makeDustFastSyncCapability = (): SyncService.SyncCapability<CoreWallet, DustFastSyncUpdate, SyncService.ChangesResult> => {
  const fallback = SyncService.makeDefaultSyncCapability();

  return {
    applyUpdate: (state, update) => {
      if (update._tag === "Events") return fallback.applyUpdate(state, update.inner);

      if (update._tag === "CaughtUp") {
        const restored = CoreWallet.updateProgress(
          { ...state, state: ledger.DustLocalState.deserialize(update.serializedState) },
          { appliedIndex: update.appliedIndex, isConnected: true },
        );
        return [restored, { changes: [], protocolVersion: Number(restored.protocolVersion) }];
      }

      let local = state.state;
      if (update.generationUpdate !== null) {
        local = local.applyGenerationCollapsedUpdate(ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(hexToBytes(update.generationUpdate)));
      }
      if (update.commitmentUpdate !== null) {
        local = local.applyCommitmentCollapsedUpdate(ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(hexToBytes(update.commitmentUpdate)));
      }
      const advanced = CoreWallet.updateProgress({ ...state, state: local }, { appliedIndex: update.appliedIndex, isConnected: true });
      return [advanced, { changes: [], protocolVersion: Number(advanced.protocolVersion) }];
    },
  };
};
