// Indexer queries for dust state. Dust data is found by the public dust address, so no viewing key is necessary.
import { hex } from "@scure/base";
import { mapWithConcurrency, type IndexerHttp } from "./indexerClient.ts";

export const hexToBytes = (s: string): Uint8Array => hex.decode(s.replace(/^0x/, ""));

/** Little-endian hex, the format of `nullifierLeBytes`. */
export const nullifierLeHex = (nullifier: bigint, byteLength = 32): string => {
  let out = "";
  let rest = nullifier;
  for (let i = 0; i < byteLength; i++) {
    out += (rest & 0xffn).toString(16).padStart(2, "0");
    rest >>= 8n;
  }
  return out;
};

export const collapsedUpdate = async (http: IndexerHttp, field: string, startIndex: number, endIndex: number): Promise<string | null> => {
  if (endIndex < startIndex) return null;
  const data = await http.query<Record<string, { update: string } | null>>(
    `query C($s: Int!, $e: Int!) { ${field}(startIndex: $s, endIndex: $e) { update } }`,
    { s: startIndex, e: endIndex },
  );
  return data[field]?.update ?? null;
};

/** Tree frontiers and transaction data from one block. All index fields are exclusive (leaf counts). */
export interface RecentTransaction {
  readonly __typename: string;
  readonly zswapEndIndex?: number;
  readonly dustCommitmentEndIndex?: number;
  readonly dustGenerationEndIndex?: number;
  readonly dustLedgerEvents?: ReadonlyArray<{ readonly id: number; readonly maxId: number }>;
}

const BLOCK_SELECTION = `
    height
    transactions {
      __typename
      ... on RegularTransaction {
        zswapEndIndex
        dustCommitmentEndIndex
        dustGenerationEndIndex
        dustLedgerEvents { id maxId }
      }
    }`;

/** Many heights in one request, one aliased `block` field for each. */
const blockBatch = (heights: ReadonlyArray<number>): string =>
  `query RecentBlocks {\n${heights.map((h, i) => `  b${i}: block(offset: { height: ${h} }) {${BLOCK_SELECTION}\n  }`).join("\n")}\n}`;

/** Aliased blocks per request. The indexer refuses 32 as "Query is too complex" and accepts 24. */
const BATCH_SIZE = 16;

/**
 * Requests in flight at the same time. Do not increase. Each `dustLedgerEvents` read blocks an indexer
 * worker thread. At about 12 concurrent reads on a 2 vCPU host, `indexer-api` stops and must be restarted.
 */
const SCAN_CONCURRENCY = 4;

/**
 * The newest block, at most `lookbackBlocks` below the tip, with a transaction that `usable` accepts.
 * Returns the usable transactions of that block. Dust transactions are sparse (up to about 200
 * blocks apart), so the scan starts with 256 blocks and doubles the range each time.
 */
export const findRecentBlock = async (
  http: IndexerHttp,
  usable: (t: RecentTransaction) => boolean,
  lookbackBlocks = 4096,
): Promise<{ height: number; transactions: RecentTransaction[] } | null> => {
  const tip = await http.query<{ block?: { height?: number } }>("query Tip { block { height } }").then((d) => d.block?.height ?? 0);
  if (!tip) return null;

  for (let waveStart = 0; waveStart < lookbackBlocks; ) {
    const waveSize = Math.min(waveStart === 0 ? 256 : waveStart, lookbackBlocks - waveStart);
    const batches: number[][] = [];
    for (let offset = waveStart; offset < waveStart + waveSize; offset += BATCH_SIZE) {
      const heights: number[] = [];
      for (let i = 0; i < BATCH_SIZE; i++) {
        const h = tip - offset - i;
        if (h > 0) heights.push(h);
      }
      if (heights.length > 0) batches.push(heights);
    }
    waveStart += waveSize;
    if (batches.length === 0) break;

    const responses = await mapWithConcurrency(batches, SCAN_CONCURRENCY, async (heights) => {
      try {
        const data = await http.query<Record<string, { height?: number; transactions?: ReadonlyArray<RecentTransaction> } | null>>(blockBatch(heights), {});
        return heights.map((_, i) => data[`b${i}`] ?? null);
      } catch {
        return heights.map(() => null);
      }
    });

    // The batches go from the tip down, so the first match is the newest.
    const found = responses.flat().find((block) => (block?.transactions ?? []).some(usable));
    if (found) return { height: found.height ?? tip, transactions: (found.transactions ?? []).filter(usable) };
  }
  return null;
};

/**
 * A point to align a dust state to. The tree frontiers and the ledger event id must come from the
 * same transaction. If they do not, replay adds events two times (the ledger refuses them) or skips events.
 */
export interface DustAlignment {
  readonly blockHeight: number;
  readonly generationFrontier: number;
  readonly commitmentFrontier: number;
  readonly ledgerEventId: number;
}

export const findDustAlignment = async (http: IndexerHttp, lookbackBlocks = 4096): Promise<DustAlignment | null> => {
  const block = await findRecentBlock(
    http,
    (t) => typeof t.dustCommitmentEndIndex === "number" && typeof t.dustGenerationEndIndex === "number" && (t.dustLedgerEvents?.length ?? 0) > 0,
    lookbackBlocks,
  );
  if (!block) return null;
  const best = block.transactions.reduce((a, b) => (b.dustCommitmentEndIndex! > a.dustCommitmentEndIndex! ? b : a));
  return {
    blockHeight: block.height,
    generationFrontier: best.dustGenerationEndIndex!,
    commitmentFrontier: best.dustCommitmentEndIndex!,
    ledgerEventId: Math.max(...best.dustLedgerEvents!.map((e) => e.id)),
  };
};
