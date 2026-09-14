// Proving in the snap with WebAssembly. See README.md in this folder.
//
// The SDK's browser prover (`makeWasmProvingService`) starts a Worker, and a snap has none. This file
// calls zkir-v2 `check`/`prove` on the snap thread instead, with the same wasm and key material.
import * as ledger from "@midnightntwrk/ledger-v9";
import { base64 } from "@scure/base";
import { check, prove, type KeyMaterialProvider, type ProvingKeyMaterial } from "@midnight-ntwrk/zkir-v2";
// Built from midnight-ledger tag ledger-9.1.0.0-rc.4. There is no npm package.
import * as zkir3 from "./zkir-v3/midnight_zkir_v3_wasm";
import { PROVING_PARAMS_URL } from "../config";

/** Base URL for key material. `getSyncOptions` in wallet.ts sets it, so this module does not import wallet.ts. */
export const provingConfig = { paramsUrl: PROVING_PARAMS_URL };

/** Ledger key location to path under `provingConfig.paramsUrl`. Same paths as the SDK's default provider. */
const KEY_PATHS: Record<string, string> = {
  "midnight/zswap/spend": "zswap/9/spend",
  "midnight/zswap/output": "zswap/9/output",
  "midnight/zswap/sign": "zswap/9/sign",
  "midnight/dust/spend": "dust/9/spend",
};

const cache = new Map<string, Promise<Uint8Array>>();

// Disk cache: the unencrypted snap state, key `params`, artifact URL to base64. The wallet state is in
// the encrypted state and this code does not touch it. The limit is 64 MB of JSON, so keep 48 MB of base64.
const DISK_LIMIT = 48_000_000;
type Disk = Record<string, string>;
let diskP: Promise<Disk> | null = null;
const disk = () =>
  (diskP ??= (snap.request({ method: "snap_getState", params: { key: "params", encrypted: false } }) as Promise<Disk | null>)
    .then((d) => d ?? {})
    .catch((): Disk => ({})));

/** Remove the oldest entries until the cache is below the limit, then save. */
async function persist(d: Disk) {
  let total = Object.values(d).reduce((a, v) => a + v.length, 0);
  for (const k of Object.keys(d)) {
    if (total <= DISK_LIMIT) break;
    total -= d[k]!.length;
    delete d[k];
  }
  await snap.request({ method: "snap_setState", params: { key: "params", value: d, encrypted: false } });
}

async function fetchBytes(url: string): Promise<Uint8Array> {
  const d = await disk();
  if (d[url]) return base64.decode(d[url]);
  // A CORS error is a bare "Failed to fetch" without the URL, so add the URL and the fix.
  const r = await fetch(url).catch((e) => {
    throw new Error(
      `proving params ${url}: ${e?.message ?? e}. The host must send Access-Control-Allow-Origin. Set another ` +
        `"Proving params URL" on the Midnight home page in MetaMask, or select "Proof server" there.`,
    );
  });
  if (!r.ok) throw new Error(`proving params ${url}: ${r.status} ${r.statusText}`);
  const b = new Uint8Array(await r.arrayBuffer());
  d[url] = base64.encode(b);
  await persist(d).catch(() => {}); // The cache is optional. A full store is not an error.
  return b;
}

/** Concurrent proofs share one download. */
function bytes(path: string): Promise<Uint8Array> {
  const url = `${provingConfig.paramsUrl}/${path}`;
  const hit = cache.get(url);
  if (hit) return hit;
  const p = fetchBytes(url).catch((e) => {
    cache.delete(url);
    throw e;
  });
  cache.set(url, p);
  return p;
}

export const keyMaterialProvider: KeyMaterialProvider = {
  async lookupKey(keyLocation) {
    const p = KEY_PATHS[keyLocation];
    if (!p) return undefined;
    const [proverKey, verifierKey, ir] = await Promise.all([bytes(`${p}.prover`), bytes(`${p}.verifier`), bytes(`${p}.bzkir`)]);
    return { proverKey, verifierKey, ir };
  },
  getParams: (k) => bytes(`bls_midnight_2p${k}`),
};

/** Provider for key material that a dApp sends with `getProvingProvider`. */
const withMaterial = (material?: ProvingKeyMaterial): KeyMaterialProvider =>
  material ? { lookupKey: async () => material, getParams: keyMaterialProvider.getParams } : keyMaterialProvider;

// The IR starts with its format tag: "midnight:ir-source[v2]:" or "midnight:ir-source[v3-generic]:".
// Wallet circuits are v2 and come without material. dApp circuits come with material, so read the tag.
const isV3 = (material?: ProvingKeyMaterial) => !!material && new TextDecoder().decode(material.ir.subarray(0, 40)).includes("ir-source[v3");

export const checkWithKeyMaterial = (preimage: Uint8Array, material?: ProvingKeyMaterial) =>
  isV3(material) ? zkir3.check(preimage, withMaterial(material)) : check(preimage, withMaterial(material));

export const proveWithKeyMaterial = (preimage: Uint8Array, material?: ProvingKeyMaterial, overwriteBindingInput?: bigint) =>
  isV3(material) ? zkir3.prove(preimage, withMaterial(material), overwriteBindingInput) : prove(preimage, withMaterial(material), overwriteBindingInput);

/** The ProvingProvider shape that `ledger.Transaction.prove` needs. */
const provingProvider = {
  check: (preimage: Uint8Array, _keyLocation: string) => checkWithKeyMaterial(preimage),
  prove: (preimage: Uint8Array, _keyLocation: string, overwriteBindingInput?: bigint) => proveWithKeyMaterial(preimage, undefined, overwriteBindingInput),
  lookupKey: (keyLocation: string) => keyMaterialProvider.lookupKey(keyLocation),
};

/** For `WalletFacade.init({ provingService })`. */
export const provingService = () => ({
  prove: (transaction: any) => transaction.prove(provingProvider, ledger.CostModel.initialCostModel()),
});
