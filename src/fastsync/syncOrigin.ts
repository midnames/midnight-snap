import { findRecentBlock } from "./dustQueries.ts";
import { makeHttp } from "./indexerClient.ts";

/**
 * The chain position where an account starts. Record it only for an account that never held funds.
 * Sync skips all history before this position, so for an account with funds the balance is wrong.
 * The snap cannot know if an account is new, so only an explicit user action records an origin.
 */
export interface WalletSyncOrigin {
  /** Zswap tree frontier. Sent to the indexer `connect` to limit its scan. */
  readonly zswapIndex: number;
  readonly capturedAt: number;
}

/**
 * Read the origin from the newest transaction with a zswap frontier. That transaction is a little
 * below the tip, which is safe: the wallet replays a little more history, it skips none.
 * Returns null on failure. Without an origin the wallet does a full sync.
 */
export const recordSyncOrigin = async (indexerHttpUrl: string): Promise<WalletSyncOrigin | null> => {
  const block = await findRecentBlock(makeHttp(indexerHttpUrl), (t) => typeof t.zswapEndIndex === "number").catch(() => null);
  if (!block) return null;
  const best = block.transactions.reduce((a, b) => (b.zswapEndIndex! > a.zswapEndIndex! ? b : a));
  return {
    zswapIndex: best.zswapEndIndex!,
    capturedAt: Date.now(),
  };
};
