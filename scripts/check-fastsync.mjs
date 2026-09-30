// Live check of the fast sync queries against an indexer. Spends nothing and needs no keys.
//
//   node scripts/check-fastsync.mjs [indexerHttpUrl]
//
// Imports the snap's own modules (Node 22 or later removes the TypeScript types).
// Not covered, because it needs a funded wallet: the spend rounds of `rebuildDustState`.
import assert from "node:assert/strict";
import * as ledger from "@midnightntwrk/ledger-v9";
import { DustAddress } from "@midnightntwrk/wallet-sdk-address-format";
import { makeHttp, makeSocket, wsUrlFor } from "../src/fastsync/indexerClient.ts";
import { recordSyncOrigin } from "../src/fastsync/syncOrigin.ts";
import { collapsedUpdate, findDustAlignment, hexToBytes, nullifierLeHex } from "../src/fastsync/dustQueries.ts";
import { gapRanges, rebuildDustState, rootHex } from "../src/fastsync/dustRebuild.ts";
import { tailCollapseRange } from "../src/fastsync/shieldedSync.ts";

// -- Pure logic. A collapse range that is one leaf too long breaks all Merkle paths. --
assert.deepEqual(tailCollapseRange(10n, 10n), null);
assert.deepEqual(tailCollapseRange(11n, 10n), null);
assert.deepEqual(tailCollapseRange(10n, 12n), { startIndex: 10, endIndex: 11 });
// The commitment leaves that are not the wallet's own.
assert.deepEqual(gapRanges(9, []), [{ start: 0, end: 9 }]);
assert.deepEqual(gapRanges(9, [0, 4, 5, 9]), [{ start: 1, end: 3 }, { start: 6, end: 8 }]);
assert.equal(rootHex(0x0102030405n), "070504030201");
assert.equal(nullifierLeHex(1n, 4), "01000000");
assert.equal(nullifierLeHex(0x0102n, 4), "02010000");
assert.deepEqual(hexToBytes("0x0aFF"), new Uint8Array([10, 255]));
assert.equal(wsUrlFor("https://indexer.stagenet.shielded.tools/api/v4/graphql"), "wss://indexer.stagenet.shielded.tools/api/v4/graphql/ws");
console.log("ok   pure logic (collapse ranges, gap ranges, root and nullifier encoding)");

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

  const zswap = await timed("zswapMerkleTreeCollapsedUpdate", () => collapsedUpdate(http, "zswapMerkleTreeCollapsedUpdate", 0, origin.zswapIndex - 1));
  check("zswap collapsed update returned", typeof zswap === "string" && zswap.length > 0, `${zswap?.length ?? 0} hex chars`);

  const past = await collapsedUpdate(http, "zswapMerkleTreeCollapsedUpdate", 0, origin.zswapIndex + 1_000_000).catch(() => null);
  check("range beyond the frontier is refused", past === null);
}

// -- Dust rebuild of a new wallet: the generation snapshot and the commitment gaps must give the roots of the block. --
const alignment = await timed("findDustAlignment", () => findDustAlignment(http));
check("findDustAlignment returned an alignment", alignment !== null);
if (alignment) {
  console.log(`     ${JSON.stringify(alignment)}`);
  check("alignment block within the chain", alignment.blockHeight > 0 && alignment.blockHeight <= tip.block.height);
  const key = ledger.DustSecretKey.fromSeed(crypto.getRandomValues(new Uint8Array(32)));
  const socket = makeSocket(wsUrlFor(url));
  const rebuilt = await timed("rebuildDustState", () => rebuildDustState({ http, socket }, key, DustAddress.encodePublicKey("stagenet", key.publicKey)))
    .catch((e) => ({ error: String(e) }))
    .finally(() => socket.close());
  check("rebuild of a new wallet matches the block roots", !("error" in rebuilt), rebuilt.error ?? `block ${rebuilt.blockHeight}`);
  if (!("error" in rebuilt)) check("rebuilt state round-trips through serialize", ledger.DustLocalState.deserialize(rebuilt.state.serialize()).utxos.length === 0);
}

console.log(`\n${failures === 0 ? "PASS" : `FAIL (${failures})`}`);
process.exit(failures === 0 ? 0 : 1);
