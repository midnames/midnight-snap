// Dust sync service with one fast path over the SDK's stock sync: a rebuild (dustRebuild.ts) makes the dust state at a
// recent block from the wallet's generations and spends, then the stock sync replays the events after that block.
// A new wallet needs it: the stock sync replays every dust event of the chain, and MetaMask delivers each one as a
// separate request. If the rebuild fails, the stock sync runs. The stock sync is slower but always correct.
import * as ledger from "@midnightntwrk/ledger-v9";
import { CoreWallet, SyncService, WalletError } from "@midnightntwrk/wallet-sdk-dust-wallet/v1";
import { Effect, Stream, type Scope } from "effect";
import { rebuildDustState, type DustRebuildResult } from "./dustRebuild.ts";
import { makeHttp, makeSocket, wsUrlFor } from "./indexerClient.ts";

const { SyncWalletError } = WalletError;

export interface DustRebuildConfiguration {
  /** Bech32m dust address. The rebuild needs no viewing key. */
  readonly dustAddress: string;
  readonly onResult?: (result: Omit<DustRebuildResult, "state"> & { readonly elapsedMs: number }) => void;
  /** The stock sync runs after this. */
  readonly onError?: (error: unknown) => void;
}

export type DustFastSyncConfiguration = SyncService.DefaultSyncConfiguration & {
  /** Rebuild the state before the stock sync. Only for a state that the stock sync cannot bring up to date quickly. */
  readonly rebuild?: DustRebuildConfiguration | null | undefined;
};

export type DustFastSyncUpdate =
  | { readonly _tag: "Rebuilt"; readonly serializedState: Uint8Array; readonly appliedIndex: bigint }
  | { readonly _tag: "Events"; readonly inner: SyncService.WalletSyncUpdate };

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
      const rebuild = config.rebuild;
      if (!rebuild) return asEvents(fallback.updates(state, secretKey));

      const rebuilt = Effect.tryPromise({
        try: async () => {
          const socket = makeSocket(config.indexerClientConnection.indexerWsUrl ?? wsUrlFor(httpUrl));
          const startedAt = Date.now();
          const result = await rebuildDustState({ http: makeHttp(httpUrl), socket }, secretKey, rebuild.dustAddress).finally(() => socket.close());
          const { state: rebuiltState, ...summary } = result;
          rebuild.onResult?.({ ...summary, elapsedMs: Date.now() - startedAt });
          return { _tag: "Rebuilt", serializedState: rebuiltState.serialize(), appliedIndex: BigInt(result.resumeEventId) } as const;
        },
        catch: (cause) => new SyncWalletError({ message: "Dust rebuild failed", cause }),
      });

      return Stream.unwrap(
        rebuilt.pipe(
          Effect.map((update) =>
            Stream.concat(
              Stream.make(update as DustFastSyncUpdate),
              asEvents(fallback.updates({ ...state, progress: { ...state.progress, appliedIndex: update.appliedIndex } }, secretKey)),
            ),
          ),
          Effect.catchAll((error) => {
            rebuild.onError?.(error.cause ?? error);
            return Effect.succeed(asEvents(fallback.updates(state, secretKey)));
          }),
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
      const rebuilt = CoreWallet.updateProgress(
        { ...state, state: ledger.DustLocalState.deserialize(update.serializedState) },
        { appliedIndex: update.appliedIndex, isConnected: true },
      );
      return [rebuilt, { changes: [], protocolVersion: Number(rebuilt.protocolVersion) }];
    },
  };
};
