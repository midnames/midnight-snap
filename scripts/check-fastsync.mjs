// Live check of the fast sync queries against an indexer. Spends nothing and needs no keys.
//
//   node scripts/check-fastsync.mjs [indexerHttpUrl]
//
// Imports the snap's own modules (Node 22 or later removes the TypeScript types).
// Not covered, because they need a WebSocket and a funded wallet: `dustGenerations`,
// `dustNullifierTransactions` and the ledger replay in `catchUpDustState`.
import assert from "node:assert/strict";
import * as ledger from "@midnightntwrk/ledger-v9";
import { makeHttp, wsUrlFor } from "../src/fastsync/indexerClient.ts";
import { recordSyncOrigin } from "../src/fastsync/syncOrigin.ts";
import { collapsedUpdate, findDustAlignment, findFrontier, hexToBytes, nullifierLeHex } from "../src/fastsync/dustQueries.ts";
import { originCollapseRange } from "../src/fastsync/dustSync.ts";
import { tailCollapseRange } from "../src/fastsync/shieldedSync.ts";
import { orderByCommitment, planSpendRound } from "../src/fastsync/dustCatchUp.ts";

// -- Pure logic. A collapse range that is one leaf too long breaks all Merkle paths. --
assert.deepEqual(originCollapseRange(0), null);
assert.deepEqual(originCollapseRange(1), { startIndex: 0, endIndex: 0 });
assert.deepEqual(originCollapseRange(4235), { startIndex: 0, endIndex: 4234 });
assert.deepEqual(tailCollapseRange(10n, 10n), null);
assert.deepEqual(tailCollapseRange(11n, 10n), null);
assert.deepEqual(tailCollapseRange(10n, 12n), { startIndex: 10, endIndex: 11 });
// One block per round, earliest first, each transaction one time.
const matches = [
  { nullifierLeBytes: "aa", transactionHash: "t2", blockHeight: 200 },
  { nullifierLeBytes: "bb", transactionHash: "t1", blockHeight: 100 },
  { nullifierLeBytes: "cc", transactionHash: "t1", blockHeight: 100 },
];
assert.deepEqual(planSpendRound(matches, new Set()), { blockHeight: 100, transactionHashes: ["t1"] });
assert.deepEqual(planSpendRound(matches, new Set(["t1"])), { blockHeight: 200, transactionHashes: ["t2"] });
assert.equal(planSpendRound(matches, new Set(["t1", "t2"])), null);
assert.deepEqual(
  orderByCommitment([{ dustCommitmentStartIndex: 9 }, { dustCommitmentStartIndex: 3 }]).map((t) => t.dustCommitmentStartIndex),
  [3, 9],
);
assert.equal(nullifierLeHex(1n, 4), "01000000");
assert.equal(nullifierLeHex(0x0102n, 4), "02010000");
assert.deepEqual(hexToBytes("0x0aFF"), new Uint8Array([10, 255]));
assert.equal(wsUrlFor("https://indexer.stagenet.shielded.tools/api/v4/graphql"), "wss://indexer.stagenet.shielded.tools/api/v4/graphql/ws");
console.log("ok   pure logic (collapse ranges, spend rounds, nullifier encoding)");

const url = process.argv[2] ?? "https://indexer.stagenet.shielded.tools/api/v4/graphql";
const http = makeHttp(url);

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};
const timed = async (name, fn) => {
  const t0 = Date.now();
  const value = await fn();
  console.log(`     (${name}: ${Date.now() - t0}ms)`);
  return value;
};

console.log(`indexer: ${url}\n`);

const tip = await http.query("query Tip { block { height } }");
check("tip block reachable", typeof tip?.block?.height === "number", `height=${tip?.block?.height}`);

// -- Origin: the values that an account marked as new now would record. --
const origin = await timed("recordSyncOrigin", () => recordSyncOrigin(url));
check("recordSyncOrigin returned an origin", origin !== null);
if (origin) {
  console.log(`     ${JSON.stringify(origin)}`);
  check("zswapIndex sane", Number.isInteger(origin.zswapIndex) && origin.zswapIndex > 0);
  check("dust.generationIndex sane", Number.isInteger(origin.dust.generationIndex) && origin.dust.generationIndex > 0);
  check("dust.commitmentIndex sane", Number.isInteger(origin.dust.commitmentIndex) && origin.dust.commitmentIndex > 0);
  check("dust.ledgerEventId sane", Number.isInteger(origin.dust.ledgerEventId) && origin.dust.ledgerEventId > 0);

  const gen = await timed("dustGenerationMerkleTreeUpdate", () => collapsedUpdate(http, "dustGenerationMerkleTreeUpdate", 0, origin.dust.generationIndex - 1));
  check("generation collapsed update returned", typeof gen === "string" && gen.length > 0, `${gen?.length ?? 0} hex chars`);

  const commit = await timed("dustCommitmentMerkleTreeUpdate", () => collapsedUpdate(http, "dustCommitmentMerkleTreeUpdate", 0, origin.dust.commitmentIndex - 1));
  check("commitment collapsed update returned", typeof commit === "string" && commit.length > 0, `${commit?.length ?? 0} hex chars`);

  const zswap = await timed("zswapMerkleTreeCollapsedUpdate", () => collapsedUpdate(http, "zswapMerkleTreeCollapsedUpdate", 0, origin.zswapIndex - 1));
  check("zswap collapsed update returned", typeof zswap === "string" && zswap.length > 0, `${zswap?.length ?? 0} hex chars`);

  // The indexer must refuse a range after the frontier. `originCollapseRange` and `findFrontier` need this.
  const past = await collapsedUpdate(http, "dustCommitmentMerkleTreeUpdate", 0, origin.dust.commitmentIndex + 1_000_000).catch(() => null);
  check("range beyond the frontier is refused", past === null);

  // The origin fast-forward through the WASM ledger, the same calls as `makeDustFastSyncCapability`.
  const local = new ledger.DustLocalState(ledger.LedgerParameters.initialParameters().dust);
  const forwarded = local
    .applyGenerationCollapsedUpdate(ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(hexToBytes(gen)))
    .applyCommitmentCollapsedUpdate(ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(hexToBytes(commit)));
  check(
    "generation tree fast-forwarded to the origin frontier",
    forwarded.generatingTreeFirstFree === BigInt(origin.dust.generationIndex),
    `firstFree=${forwarded.generatingTreeFirstFree} origin=${origin.dust.generationIndex}`,
  );
  check(
    "commitment tree fast-forwarded to the origin frontier",
    forwarded.commitmentTreeFirstFree === BigInt(origin.dust.commitmentIndex),
    `firstFree=${forwarded.commitmentTreeFirstFree} origin=${origin.dust.commitmentIndex}`,
  );
  check("fast-forwarded state round-trips through serialize", ledger.DustLocalState.deserialize(forwarded.serialize()).utxos.length === 0);
}

// -- Catch-up: alignment and frontier search. --
const alignment = await timed("findDustAlignment", () => findDustAlignment(http));
check("findDustAlignment returned an alignment", alignment !== null);
if (alignment) {
  console.log(`     ${JSON.stringify(alignment)}`);
  check("alignment block within the chain", alignment.blockHeight > 0 && alignment.blockHeight <= tip.block.height);
  check("alignment frontiers sane", alignment.generationFrontier > 0 && alignment.commitmentFrontier > 0);
  check("alignment event id sane", alignment.ledgerEventId > 0);
  if (origin) {
    check(
      "alignment agrees with the recorded origin",
      Math.abs(alignment.commitmentFrontier - origin.dust.commitmentIndex) <= 64,
      `alignment=${alignment.commitmentFrontier} origin=${origin.dust.commitmentIndex}`,
    );
  }

  const frontier = await timed("findFrontier(commitment)", () =>
    findFrontier(http, "dustCommitmentMerkleTreeUpdate", Math.max(0, alignment.commitmentFrontier - 1000)),
  );
  check("binary-searched frontier matches the alignment", Math.abs(frontier + 1 - alignment.commitmentFrontier) <= 64, `search=${frontier} alignment=${alignment.commitmentFrontier}`);
}

console.log(`\n${failures === 0 ? "PASS" : `FAIL (${failures})`}`);
process.exit(failures === 0 ? 0 : 1);
