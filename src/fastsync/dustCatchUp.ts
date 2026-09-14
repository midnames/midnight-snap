// Dust catch-up: bring a saved dust state up to date without a replay of the chain. The saved state
// already has the wallet's UTXOs, so find which were spent and which new dust was generated.
// The cost depends on the wallet's activity, not on the time since the last save.
import * as ledger from "@midnightntwrk/ledger-v9";
import type { IndexerHttp, IndexerSocket } from "./indexerClient.ts";
import {
  DUST_GENERATIONS,
  DUST_NULLIFIER_SPEND,
  collapsedUpdate,
  fetchDustTransaction,
  findDustAlignment,
  hexToBytes,
  nullifierLeHex,
  type DustGenerationItem,
  type DustTransaction,
} from "./dustQueries.ts";

/** Where a saved dust state ends. */
export interface DustCatchUpAnchor {
  /** Block height at save time. Start of the spend scan. */
  readonly blockHeight: number;
  /** Generation tree frontier at save time. New generations start here. */
  readonly generationFrontier: number;
  /** Commitment tree frontier at save time. */
  readonly commitmentFrontier: number;
}

export interface DustCatchUpResult {
  readonly state: ledger.DustLocalState;
  readonly anchor: DustCatchUpAnchor;
  /** Dust ledger event id of the returned state. The next replay starts here, not at the saved offset. */
  readonly resumeEventId: number;
  readonly spendsApplied: number;
  readonly generationsAdded: number;
  readonly roundTrips: number;
}

export interface DustCatchUpDeps {
  readonly http: IndexerHttp;
  readonly socket: IndexerSocket;
}

export interface SpendMatch {
  readonly nullifierLeBytes: string;
  readonly transactionHash: string;
  readonly blockHeight: number;
}

/**
 * The transactions for one round: the earliest block with matches that are not applied, and each
 * different transaction in it. An error here gives an incomplete state, not an exception.
 */
export const planSpendRound = (
  matches: ReadonlyArray<SpendMatch>,
  done: ReadonlySet<string>,
): { blockHeight: number; transactionHashes: string[] } | null => {
  const pending = matches.filter((m) => !done.has(m.transactionHash));
  if (pending.length === 0) return null;
  const blockHeight = pending.reduce((a, b) => (b.blockHeight < a.blockHeight ? b : a)).blockHeight;
  // One transaction can spend several of the wallet's UTXOs. Apply it one time only.
  return { blockHeight, transactionHashes: [...new Set(pending.filter((m) => m.blockHeight === blockHeight).map((m) => m.transactionHash))] };
};

/** Chain order in a block is commitment index order. In a different order the ledger refuses the events. */
export const orderByCommitment = (transactions: ReadonlyArray<DustTransaction>): DustTransaction[] =>
  [...transactions].sort((a, b) => (a.dustCommitmentStartIndex ?? 0) - (b.dustCommitmentStartIndex ?? 0));

/**
 * Nullifier prefix length in hex characters. Do not use 16 (8 bytes): the indexer returns no match
 * for an 8-byte prefix of a spent nullifier (measured on mainnet; 1 to 6, 10, 12, 16, 20 and 32 bytes
 * work). An empty result looks like "not spent" and gives a wrong balance. Each match is checked
 * against the full nullifier, so a short prefix only adds some rows.
 */
export const NULLIFIER_PREFIX_HEX = 12;

/**
 * Apply all spends of the wallet's dust to one shared state.
 *
 * A spend makes a successor UTXO with a new nullifier, so the next spend is visible only after the
 * current one is applied. Each round scans, then applies one block: the earliest block with a match.
 * Spends of different dust lines interleave, and the commitment cursor must only move forward in
 * chain order.
 */
const applySpends = async (
  deps: DustCatchUpDeps,
  initial: ledger.DustLocalState,
  secretKey: ledger.DustSecretKey,
  fromBlock: number,
  tipBlock: number,
  commitmentCursor: number,
  maxRounds: number,
): Promise<{ state: ledger.DustLocalState; cursor: number; applied: number; roundTrips: number }> => {
  let state = initial;
  let cursor = commitmentCursor;
  let scanFrom = fromBlock;
  let applied = 0;
  let roundTrips = 0;
  // Applied transactions. The next scan finds them again, because the block range still includes them.
  const done = new Set<string>();

  for (let round = 0; round < maxRounds; round++) {
    const utxos = [...state.utxos];
    if (utxos.length === 0) break;

    const byNullifier = new Map<string, ledger.QualifiedDustOutput>();
    for (const utxo of utxos) byNullifier.set(nullifierLeHex(ledger.dustNullifier(utxo, secretKey)), utxo);
    const prefixes = [...byNullifier.keys()].map((n) => n.slice(0, NULLIFIER_PREFIX_HEX));

    const payloads = await deps.socket.collect<{ dustNullifierTransactions: SpendMatch }>(
      DUST_NULLIFIER_SPEND,
      { prefixes, fromBlock: scanFrom, toBlock: tipBlock },
      { maxMs: 60_000 },
    );
    roundTrips++;

    // A prefix can match a different nullifier. Keep exact matches only.
    const matches = payloads.map((p) => p.dustNullifierTransactions).filter((m) => byNullifier.has(m.nullifierLeBytes));
    const plan = planSpendRound(matches, done);
    if (!plan) break;
    for (const hash of plan.transactionHashes) done.add(hash);

    // One at a time: a block has few dust transactions, and concurrent `dustLedgerEvents` reads can stop the indexer.
    const fetched: DustTransaction[] = [];
    for (const hash of plan.transactionHashes) {
      const spend = await fetchDustTransaction(deps.http, hash);
      roundTrips++;
      if (spend?.dustLedgerEvents?.length) fetched.push(spend);
    }

    for (const spend of orderByCommitment(fetched)) {
      if (typeof spend.dustCommitmentEndIndex === "number" && spend.dustCommitmentEndIndex <= cursor) continue; // Already in the state.

      // Move the tree to the start of this transaction first, or its commitments get wrong indices.
      if (typeof spend.dustCommitmentStartIndex === "number" && spend.dustCommitmentStartIndex > cursor) {
        const gap = await collapsedUpdate(deps.http, "dustCommitmentMerkleTreeUpdate", cursor, spend.dustCommitmentStartIndex - 1);
        roundTrips++;
        if (gap) state = state.applyCommitmentCollapsedUpdate(ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(hexToBytes(gap)));
      }

      state = state.replayEvents(secretKey, spend.dustLedgerEvents!.map((e) => ledger.Event.deserialize(hexToBytes(e.raw))));
      if (typeof spend.dustCommitmentEndIndex === "number") cursor = spend.dustCommitmentEndIndex;
      applied++;
    }

    // A dust line can be spent again in the same block, so the next scan starts at this block.
    scanFrom = plan.blockHeight;
  }

  return { state, cursor, applied, roundTrips };
};

/** Add new generations in commitment index order. */
const applyNewGenerations = async (
  deps: DustCatchUpDeps,
  initial: ledger.DustLocalState,
  items: ReadonlyArray<DustGenerationItem>,
  secretKey: ledger.DustSecretKey,
  commitmentCursor: number,
): Promise<{ state: ledger.DustLocalState; cursor: number; roundTrips: number }> => {
  let state = initial;
  let cursor = commitmentCursor;
  let roundTrips = 0;

  for (const item of [...items].sort((a, b) => a.commitmentMtIndex - b.commitmentMtIndex)) {
    if (item.commitmentMtIndex > cursor) {
      const gap = await collapsedUpdate(deps.http, "dustCommitmentMerkleTreeUpdate", cursor, item.commitmentMtIndex - 1);
      roundTrips++;
      if (gap) state = state.applyCommitmentCollapsedUpdate(ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(hexToBytes(gap)));
    }
    const generating = await fetchDustTransaction(deps.http, item.transactionHash);
    roundTrips++;
    if (!generating?.dustLedgerEvents?.length) continue;
    state = state.replayEvents(secretKey, generating.dustLedgerEvents.map((e) => ledger.Event.deserialize(hexToBytes(e.raw))));
    cursor = Math.max(cursor, item.commitmentMtIndex + 1);
  }

  return { state, cursor, roundTrips };
};

export const catchUpDustState = async (
  deps: DustCatchUpDeps,
  state: ledger.DustLocalState,
  anchor: DustCatchUpAnchor,
  dustAddress: string,
  secretKey: ledger.DustSecretKey,
  options: { readonly maxRounds?: number } = {},
): Promise<DustCatchUpResult> => {
  // Maximum blocks with a spend per catch-up. The next catch-up continues from the new anchor.
  const maxRounds = options.maxRounds ?? 64;
  let roundTrips = 1;
  const unchanged = { state, anchor, resumeEventId: 0, spendsApplied: 0, generationsAdded: 0 };

  // All positions below come from one transaction, so they describe the same point in the chain.
  const alignment = await findDustAlignment(deps.http);
  if (!alignment) return { ...unchanged, roundTrips };
  const { generationFrontier, commitmentFrontier, blockHeight: tip } = alignment;

  // The newest dust transaction is not after the save. There is nothing to apply.
  if (tip <= anchor.blockHeight || commitmentFrontier < anchor.commitmentFrontier) return { ...unchanged, roundTrips };

  // Spends first: their successors have lower commitment indices than new generations.
  const spent = await applySpends(deps, state, secretKey, anchor.blockHeight, tip, anchor.commitmentFrontier, maxRounds);
  roundTrips += spent.roundTrips;

  // Query generations only when the tree grew. Other wallets also grow it, and then this wallet's
  // query sends nothing and does not end: the idle bound ends it.
  let fresh: DustGenerationItem[] = [];
  if (generationFrontier > anchor.generationFrontier) {
    const payloads = await deps.socket.collect<{ dustGenerations: ({ __typename: string } & Partial<DustGenerationItem>) | null }>(
      DUST_GENERATIONS,
      { address: dustAddress, startIndex: anchor.generationFrontier, endIndex: generationFrontier },
      { maxMs: 60_000, idleMs: 8_000 },
    );
    roundTrips++;
    fresh = payloads
      .map((p) => p.dustGenerations)
      .filter((g): g is { __typename: string } & DustGenerationItem => !!g && g.__typename === "DustGenerationsItem");
  }

  const generated = await applyNewGenerations(deps, spent.state, fresh, secretKey, spent.cursor);
  roundTrips += generated.roundTrips;

  // Move both trees to the alignment frontiers. Frontiers are exclusive, and collapse ranges are inclusive.
  let finalState = generated.state;
  if (generated.cursor < commitmentFrontier) {
    const tail = await collapsedUpdate(deps.http, "dustCommitmentMerkleTreeUpdate", generated.cursor, commitmentFrontier - 1);
    roundTrips++;
    if (tail) finalState = finalState.applyCommitmentCollapsedUpdate(ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(hexToBytes(tail)));
  }
  if (anchor.generationFrontier < generationFrontier) {
    const tail = await collapsedUpdate(deps.http, "dustGenerationMerkleTreeUpdate", anchor.generationFrontier, generationFrontier - 1);
    roundTrips++;
    if (tail) finalState = finalState.applyGenerationCollapsedUpdate(ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(hexToBytes(tail)));
  }

  return {
    state: finalState,
    anchor: { blockHeight: tip, generationFrontier, commitmentFrontier },
    resumeEventId: alignment.ledgerEventId,
    spendsApplied: spent.applied,
    generationsAdded: fresh.length,
    roundTrips,
  };
};
