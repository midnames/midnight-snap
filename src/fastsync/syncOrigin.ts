import { findRecentBlock } from "./dustQueries.ts";
import { makeHttp } from "./indexerClient.ts";
import type { DustSyncOrigin } from "./dustSync.ts";

/**
 * The chain position where an account starts. Record it only for an account that never held funds.
 * Sync skips all history before this position, so for an account with funds the balance is wrong.
 * The snap cannot know if an account is new, so only an explicit user action records an origin.
 */
export interface WalletSyncOrigin {
  /** Zswap tree frontier. Sent to the indexer `connect` to limit its scan. */
  readonly zswapIndex: number;
  readonly dust: DustSyncOrigin;
  readonly capturedAt: number;
}

/**
 * Read the origin from the newest transaction that has all three frontiers. That transaction is a
 * little below the tip, which is safe: the wallet replays a little more history, it skips none.
 * Returns null on failure. Without an origin the wallet does a full sync.
 */
export const recordSyncOrigin = async (indexerHttpUrl: string): Promise<WalletSyncOrigin | null> => {
  const block = await findRecentBlock(
    makeHttp(indexerHttpUrl),
    (t) =>
      typeof t.zswapEndIndex === "number" &&
      typeof t.dustCommitmentEndIndex === "number" &&
      typeof t.dustGenerationEndIndex === "number" &&
      (t.dustLedgerEvents?.length ?? 0) > 0,
  ).catch(() => null);
  if (!block) return null;
  const best = block.transactions.reduce((a, b) => (b.zswapEndIndex! > a.zswapEndIndex! ? b : a));
  return {
    zswapIndex: best.zswapEndIndex!,
    dust: {
      generationIndex: best.dustGenerationEndIndex!,
      commitmentIndex: best.dustCommitmentEndIndex!,
      // The last event of this transaction, not `maxId`. `maxId` is the global tip, and the trees
      // are only at this transaction's position, so replay from `maxId` would skip events.
      ledgerEventId: Math.max(...best.dustLedgerEvents!.map((e) => e.id)),
    },
    capturedAt: Date.now(),
  };
};
