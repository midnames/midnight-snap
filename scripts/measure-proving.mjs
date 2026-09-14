// Benchmark: proving with the zkir-v2 wasm, as the snap does, on a local Midnight network
// (indexer 8088, node 9944). The wallet with SEED must have NIGHT, DUST and shielded NIGHT.
//
//   SEED=<hex> KM_CACHE=/tmp/km node scripts/measure-proving.mjs
//   PARAMS_URL=http://127.0.0.1:8099 SEED=<hex> node scripts/measure-proving.mjs   # use a mirror, no disk cache
//
// To measure the proof server (6300), remove the `provingService` line. Results are in src/proving/README.md.
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import * as ledger from '@midnightntwrk/ledger-v9';
import { WalletFacade } from '@midnightntwrk/wallet-sdk-facade';
import { ShieldedWallet } from '@midnightntwrk/wallet-sdk-shielded';
import { DustWallet } from '@midnightntwrk/wallet-sdk-dust-wallet';
import { UnshieldedWallet, PublicKey, createKeystore } from '@midnightntwrk/wallet-sdk-unshielded-wallet';
import { HDWallet, Roles } from '@midnightntwrk/wallet-sdk-hd';
import { MidnightBech32m, UnshieldedAddress, ShieldedAddress, ShieldedCoinPublicKey, ShieldedEncryptionPublicKey } from '@midnightntwrk/wallet-sdk-address-format';
import { check, prove } from '@midnight-ntwrk/zkir-v2';

const CACHE = process.env.KM_CACHE;
const PARAMS = process.env.PARAMS_URL ?? 'https://midnight-s3-fileshare-dev-eu-west-1.s3.eu-west-1.amazonaws.com';
const KEY_PATHS = { 'midnight/zswap/spend': 'zswap/9/spend', 'midnight/zswap/output': 'zswap/9/output', 'midnight/zswap/sign': 'zswap/9/sign', 'midnight/dust/spend': 'dust/9/spend' };

const timings = [];
const download = async (name) => {
  const f = `${CACHE}/${name}`;
  if (CACHE && existsSync(f)) return new Uint8Array(readFileSync(f));
  const t = Date.now();
  const b = new Uint8Array(await (await fetch(`${PARAMS}/${name}`)).arrayBuffer());
  timings.push(`  fetch ${name}: ${b.length} bytes in ${Date.now() - t}ms`);
  if (CACHE) {
    mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, b);
  }
  return b;
};
const mem = new Map();
const once = (key, fn) => (mem.has(key) ? mem.get(key) : mem.set(key, fn()).get(key));
const km = {
  lookupKey: async (loc) => {
    const p = KEY_PATHS[loc];
    return p && once(p, async () => ({ proverKey: await download(`${p}.prover`), verifierKey: await download(`${p}.verifier`), ir: await download(`${p}.bzkir`) }));
  },
  getParams: (k) => once(`p${k}`, () => download(`bls_midnight_2p${k}`)),
};

let nProve = 0, tProve = 0;
const provider = {
  check: (pre) => check(pre, km),
  prove: async (pre, _loc, ob) => {
    const t = Date.now();
    const r = await prove(pre, km, ob);
    nProve++;
    tProve += Date.now() - t;
    return r;
  },
  lookupKey: (l) => km.lookupKey(l),
};

const hd = HDWallet.fromSeed(new Uint8Array(Buffer.from(process.env.SEED, 'hex')));
const keys = hd.hdWallet.selectAccount(0).selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust]).deriveKeysAt(0).keys;
const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(keys[Roles.Zswap]);
const dustSecretKey = ledger.DustSecretKey.fromSeed(keys[Roles.Dust]);
const ks = createKeystore({ kind: 'schnorr', secret: keys[Roles.NightExternal] }, 'undeployed');
const noHistory = { gotPending: async () => {}, gotFinalized: async () => {}, gotRejected: async () => {}, getAll: async () => [], get: async () => undefined, serialize: async () => '' };

const f = await WalletFacade.init({
  configuration: {
    networkId: 'undeployed',
    indexerClientConnection: { indexerHttpUrl: 'http://127.0.0.1:8088/api/v4/graphql', indexerWsUrl: 'ws://127.0.0.1:8088/api/v4/graphql/ws' },
    provingServerUrl: new URL('http://127.0.0.1:6300'),
    relayURL: new URL('ws://127.0.0.1:9944'),
    costParameters: { feeBlocksMargin: 100 },
    txHistoryStorage: noHistory,
  },
  provingService: () => ({ prove: (tx) => tx.prove(provider, ledger.CostModel.initialCostModel()) }),
  shielded: (c) => ShieldedWallet(c).startWithSecretKeys(shieldedSecretKeys),
  unshielded: (c) => UnshieldedWallet(c).startWithPublicKey(PublicKey.fromKeyStore(ks)),
  dust: (c) => DustWallet(c).startWithSecretKey(dustSecretKey, ledger.LedgerParameters.initialParameters().dust),
});
await f.start(shieldedSecretKeys, dustSecretKey);
await f.waitForSyncedState();
console.log('synced');

const N = ledger.nativeToken().raw;
const toUnshielded = MidnightBech32m.parse(ks.getBech32Address().asString()).decode(UnshieldedAddress, 'undeployed');
const toShielded = new ShieldedAddress(
  new ShieldedCoinPublicKey(Buffer.from(shieldedSecretKeys.coinPublicKey, 'hex')),
  new ShieldedEncryptionPublicKey(Buffer.from(shieldedSecretKeys.encryptionPublicKey, 'hex')),
);

async function run(label, outputs) {
  nProve = tProve = 0;
  const recipe = await f.transferTransaction(outputs, { shieldedSecretKeys, dustSecretKey }, { ttl: new Date(Date.now() + 3_600_000), payFees: true });
  const signed = await f.signRecipe(recipe, ks.signDataAsync);
  const t = Date.now();
  await f.finalizeRecipe(signed);
  console.log(`${label}: finalize ${Date.now() - t}ms (${nProve} proofs, ${tProve}ms)`);
  await f.revert(recipe).catch(() => {});
}
await run('unshielded transfer + dust fee', [{ type: 'unshielded', outputs: [{ type: N, receiverAddress: toUnshielded, amount: 1000000n }] }]);
await run('shielded transfer + dust fee', [{ type: 'shielded', outputs: [{ type: N, receiverAddress: toShielded, amount: 1000n }] }]);
console.log('\nfetch timings (not accurate: the prover blocks the thread):\n' + timings.join('\n'));
await f.stop();
process.exit(0);
