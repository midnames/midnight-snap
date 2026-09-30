// Dust rebuild: make a wallet's dust state at a recent block without a replay of the chain. This is the "eventless" sync
// of wallet-sdk-dust-wallet 5.0.0-rc.0 (v2/Sync.ts), on ledger-v9 rc.3 and the indexer queries of this folder:
//   1. The indexer sends the wallet's generations at a block, with collapsed updates for the other leaves.
//   2. Each generated dust output is followed through its spends, by nullifier, to the output that is not spent.
//   3. The commitment tree gets the wallet's unspent outputs and collapsed updates for the other leaves.
// The two tree roots must then be equal to the roots of the block.
import * as ledger from "@midnightntwrk/ledger-v9";
import type { IndexerHttp, IndexerSocket } from "./indexerClient.ts";
import { collapsedUpdate, findDustAlignment, hexToBytes, nullifierLeHex } from "./dustQueries.ts";

/**
 * Nullifier prefix length in hex characters. Do not use 16 (8 bytes): the indexer returns no match
 * for an 8-byte prefix of a spent nullifier (measured; 1 to 6, 10, 12, 16, 20 and 32 bytes
 * work). An empty result looks like "not spent" and gives a wrong balance. Each match is checked
 * against the full nullifier, so a short prefix only adds some rows.
 */
export const NULLIFIER_PREFIX_HEX = 12;

const BLOCK = `
  query RebuildBlock($height: Int!) {
    block(offset: { height: $height }) {
      height hash timestamp ledgerParameters
      dustCommitmentEndIndex dustGenerationEndIndex dustCommitmentMerkleTreeRoot dustGenerationMerkleTreeRoot
    }
  }`;

const GENERATIONS = `
  subscription RebuildGenerations($dustAddress: DustAddress!, $blockHash: HexEncoded!, $dtimeCutoffHeight: Int!) {
    dustGenerations(dustAddress: $dustAddress, blockHash: $blockHash, dtimeCutoffHeight: $dtimeCutoffHeight) {
      __typename
      ... on DustGenerationsItem {
        commitmentMtIndex generationMtIndex owner value initialValue backingNight ctime
        collapsedMerkleTree { startIndex endIndex update }
      }
      ... on DustGenerationsProgress { collapsedMerkleTree { startIndex endIndex update } }
      ... on DustGenerationDtimeUpdateItem { generationMtIndex nightUtxoHash treeInsertionPath }
    }
  }`;

/** Always send `toBlock`. Without it the subscription waits for new blocks and does not end. */
const SPENDS = `
  subscription RebuildSpends($prefixes: [HexEncoded!]!, $toBlock: Int) {
    dustNullifierTransactions(nullifierLeBytesPrefixes: $prefixes, fromBlock: 0, toBlock: $toBlock) {
      nullifierLeBytes
      transaction {
        block { ledgerParameters }
        ... on RegularTransaction { dustLedgerEvents { raw } }
      }
    }
  }`;

type Collapsed = { startIndex: number; endIndex: number; update: string } | null;
type Generation =
  | { __typename: "DustGenerationsItem"; commitmentMtIndex: number; generationMtIndex: number; owner: string; value: string; initialValue: string; backingNight: string; ctime: number; collapsedMerkleTree: Collapsed }
  | { __typename: "DustGenerationsProgress"; collapsedMerkleTree: Collapsed }
  | { __typename: "DustGenerationDtimeUpdateItem"; generationMtIndex: number; nightUtxoHash: string; treeInsertionPath: string };
type Spend = { nullifierLeBytes: string; transaction: { block: { ledgerParameters: string }; dustLedgerEvents?: Array<{ raw: string }> } };

type DustSpend = Extract<ledger.Event["content"], { tag: "dustSpendProcessed" }>;
const isSpendOf = (c: { tag: string }, nullifier: bigint): c is DustSpend => c.tag === "dustSpendProcessed" && (c as DustSpend).nullifier === nullifier;

/** A dust output of this wallet, with the generation that backs it. */
type Owned = { nullifier: bigint; qdo: ledger.QualifiedDustOutput; genInfo: ledger.DustGenerationInfo };

export interface DustRebuildResult {
  readonly state: ledger.DustLocalState;
  /** Dust ledger event id at the rebuilt block. The event stream continues after it. */
  readonly resumeEventId: number;
  readonly blockHeight: number;
  readonly outputs: number;
  readonly spends: number;
}

const readCollapsed = (c: NonNullable<Collapsed>) => ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(hexToBytes(c.update));

/** Index ranges of `[0, max]` without the `skip` indices (sorted). */
export const gapRanges = (max: number, skip: ReadonlyArray<number>): Array<{ start: number; end: number }> =>
  [-1, ...skip].map((boundary, i) => ({ start: boundary + 1, end: (skip[i] ?? max + 1) - 1 })).filter(({ start, end }) => start <= end);

export const rebuildDustState = async (
  deps: { http: IndexerHttp; socket: IndexerSocket },
  secretKey: ledger.DustSecretKey,
  dustAddress: string,
): Promise<DustRebuildResult> => {
  // The event id and the tree frontiers come from the same transaction, so the event stream continues without a gap.
  const alignment = await findDustAlignment(deps.http);
  if (!alignment) throw new Error("no dust alignment");
  const { block } = await deps.http.query<{ block: { hash: string; timestamp: number; ledgerParameters: string; dustCommitmentEndIndex: number; dustGenerationEndIndex: number; dustCommitmentMerkleTreeRoot: string; dustGenerationMerkleTreeRoot: string } }>(BLOCK, { height: alignment.blockHeight });
  if (block.dustCommitmentEndIndex !== alignment.commitmentFrontier || block.dustGenerationEndIndex !== alignment.generationFrontier) {
    throw new Error("the alignment transaction is not the last dust transaction of its block");
  }
  const params = ledger.LedgerParameters.deserialize(hexToBytes(block.ledgerParameters)).dust;
  const publicKey = secretKey.publicKey;

  // 1. Generations.
  const items = (await deps.socket.collect<{ dustGenerations: Generation }>(GENERATIONS, { dustAddress, blockHash: block.hash, dtimeCutoffHeight: 0 }, { maxMs: 60_000 })).map((p) => p.dustGenerations);
  const dtimes = new Map<string, ledger.DustGenerationTreeInsertionPath>();
  const own = items.filter((g): g is Extract<Generation, { __typename: "DustGenerationsItem" }> => g.__typename === "DustGenerationsItem").sort((a, b) => a.generationMtIndex - b.generationMtIndex);
  const dtimeUpdates = items.filter((g): g is Extract<Generation, { __typename: "DustGenerationDtimeUpdateItem" }> => g.__typename === "DustGenerationDtimeUpdateItem").sort((a, b) => a.generationMtIndex - b.generationMtIndex);
  for (const u of dtimeUpdates) dtimes.set(u.nightUtxoHash, ledger.DustGenerationTreeInsertionPath.deserialize(hexToBytes(u.treeInsertionPath)));

  let state = new ledger.DustLocalState(params);
  const gaps = items.flatMap((g) => ("collapsedMerkleTree" in g && g.collapsedMerkleTree ? [g.collapsedMerkleTree] : [])).sort((a, b) => a.startIndex - b.startIndex);
  let next = 0;
  const applyGapsBelow = (index: number) => {
    for (; next < gaps.length && gaps[next]!.endIndex < index; next++) state = state.applyGenerationCollapsedUpdate(readCollapsed(gaps[next]!));
  };
  const generated: Owned[] = own.map((g) => {
    const genInfo: ledger.DustGenerationInfo = { value: BigInt(g.value), owner: publicKey, nonce: g.backingNight, dtime: undefined };
    applyGapsBelow(g.generationMtIndex);
    state = state.insertGenerationInfo(BigInt(g.generationMtIndex), genInfo, g.backingNight);
    const qdo: ledger.QualifiedDustOutput = {
      initialValue: BigInt(g.initialValue),
      owner: publicKey,
      nonce: ledger.dustFirstNonce(g.backingNight, publicKey),
      seq: 0,
      ctime: new Date(g.ctime * 1000),
      backingNight: g.backingNight,
      mtIndex: BigInt(g.commitmentMtIndex),
    };
    return { nullifier: ledger.dustNullifier(qdo, secretKey), qdo, genInfo };
  });
  applyGapsBelow(Number.MAX_SAFE_INTEGER);
  for (const evidence of dtimes.values()) state = state.updateGenerationTreeFromEvidence(evidence);

  // 2. Spends. A spend makes a successor with a new nullifier, so each round looks up the nullifiers of the last round.
  const unspent = new Map<string, Owned>(generated.map((o) => [nullifierLeHex(o.nullifier), o]));
  let check = [...unspent.keys()];
  let spends = 0;
  while (check.length > 0) {
    const checking = new Set(check);
    const matches = (await deps.socket.collect<{ dustNullifierTransactions: Spend }>(SPENDS, { prefixes: [...new Set(check.map((n) => n.slice(0, NULLIFIER_PREFIX_HEX)))], toBlock: alignment.blockHeight }, { maxMs: 60_000 }))
      .map((p) => p.dustNullifierTransactions)
      .filter((m) => checking.has(m.nullifierLeBytes));
    check = [];
    for (const match of matches) {
      const spent = unspent.get(match.nullifierLeBytes);
      if (!spent) continue; // Already applied: one transaction can match several times.
      const blockDust = ledger.LedgerParameters.deserialize(hexToBytes(match.transaction.block.ledgerParameters)).dust;
      for (const raw of match.transaction.dustLedgerEvents ?? []) {
        const content = ledger.Event.deserialize(hexToBytes(raw.raw)).content as { tag: string } | DustSpend;
        if (!isSpendOf(content, spent.nullifier)) continue;
        // The successor decays from the time that the backing NIGHT was spent, if it was.
        const genInfo = { ...spent.genInfo, dtime: dtimeOf(state, spent) };
        const qdo = ledger.successorDustUtxo(spent.qdo, content.declaredTime, content.vFee, content.commitmentIndex, genInfo, secretKey, blockDust);
        const successor = { nullifier: ledger.dustNullifier(qdo, secretKey), qdo, genInfo: spent.genInfo };
        unspent.delete(match.nullifierLeBytes);
        unspent.set(nullifierLeHex(successor.nullifier), successor);
        check.push(nullifierLeHex(successor.nullifier));
        spends++;
      }
    }
  }

  // 3. Commitments: the unspent outputs of this wallet at their indices, collapsed updates for the other leaves.
  const outputs = [...unspent.values()].sort((a, b) => Number(a.qdo.mtIndex - b.qdo.mtIndex));
  for (const o of outputs) state = state.addUtxo(o.nullifier, o.qdo);
  const ranges = gapRanges(alignment.commitmentFrontier - 1, outputs.map((o) => Number(o.qdo.mtIndex)));
  let o = 0;
  for (const range of ranges) {
    for (; o < outputs.length && Number(outputs[o]!.qdo.mtIndex) < range.start; o++) state = state.insertCommitment(outputs[o]!.qdo.mtIndex, outputs[o]!.qdo, true);
    const update = await collapsedUpdate(deps.http, "dustCommitmentMerkleTreeUpdate", range.start, range.end);
    if (update) state = state.applyCommitmentCollapsedUpdate(ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(hexToBytes(update)));
  }
  for (; o < outputs.length; o++) state = state.insertCommitment(outputs[o]!.qdo.mtIndex, outputs[o]!.qdo, true);
  state = state.processTtls(new Date(block.timestamp));

  const roots = [rootHex(state.commitmentTreeRoot()), rootHex(state.generatingTreeRoot())];
  if (roots[0] !== strip(block.dustCommitmentMerkleTreeRoot) || roots[1] !== strip(block.dustGenerationMerkleTreeRoot)) {
    throw new Error(`dust rebuild roots differ from block ${alignment.blockHeight}: ${roots.join(",")} vs ${block.dustCommitmentMerkleTreeRoot},${block.dustGenerationMerkleTreeRoot}`);
  }
  return { state, resumeEventId: alignment.ledgerEventId, blockHeight: alignment.blockHeight, outputs: outputs.length, spends };
};

/** The decay time of the generation that backs `o`, from the rebuilt generation tree. */
const dtimeOf = (state: ledger.DustLocalState, o: Owned): Date | undefined => state.generationInfo(o.qdo)?.dtime;

const strip = (h: string) => h.replace(/^0x/, "").toLowerCase();

/** A tree root as the indexer writes it: SCALE compact, a length byte and the minimal little-endian bytes. Only for values of 2^32 and more. */
export const rootHex = (root: bigint | undefined): string => {
  if (root === undefined) return "";
  const le = nullifierLeHex(root).replace(/(00)+$/, "");
  return (((le.length / 2 - 4) << 2) | 3).toString(16).padStart(2, "0") + le;
};
