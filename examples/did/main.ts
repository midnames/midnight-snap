// Create and update a did:midnight DID through the Midnight Snap. The contract is did.compact of
// midnightntwrk/midnight-did 0.5.0. The snap balances, proves and submits. The page holds the DID's controller key.
import { ecMulGenerator } from '@midnight-ntwrk/compact-runtime';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenDeployTxFromVerifierKeys, submitCallTx, submitInsertVerifierKeyTx, submitTx } from '@midnight-ntwrk/midnight-js-contracts';
import { dappConnectorProofProvider } from '@midnight-ntwrk/midnight-js-dapp-connector-proof-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { getNetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { ContractDeploy, ContractState, CostModel, Intent, Transaction } from '@midnightntwrk/ledger-v9';
import { sha256 } from '@noble/hashes/sha2.js';
import { registerMidnightSnap } from '../../connector/src/index.ts';
import * as DID from './managed/DID/contract/index.js';
import { pureCircuits as schnorr } from './managed/Schnorr/contract/index.js';

const NETWORK_ID = 'stagenet';
const SNAP_ID = new URLSearchParams(location.search).get('snap') ?? 'local:http://localhost:8093';
// Stagenet refuses a deploy that is too large ("1010: Transaction would exhaust the block limits"). The page deploys
// these circuits and adds another circuit's verifier key when it first needs it.
const DEPLOY_OPS = ['setService'];

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const address = $<HTMLInputElement>('address');
const buttons = [...document.querySelectorAll('button')];
const log = (line: string) => ($('log').textContent += `${new Date().toLocaleTimeString()}  ${line}\n`);

const toHex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (hex: string) => Uint8Array.from(hex.match(/../g) ?? [], (b) => parseInt(b, 16));

// Jubjub Schnorr, as packages/jubjub-schnorr/src/signing.ts of midnight-did signs controller authorizations.
const JUBJUB_ORDER = 6554484396890773809930967563523245729705921265872317281365359162392183254199n;
const TWO_248 = 1n << 248n;
const scalarOf = (bytes: Uint8Array) => BigInt('0x' + toHex(sha256(bytes))) % JUBJUB_ORDER;

/** The secrets of one DID. They are in localStorage, so anyone with this browser profile controls the DID. */
type Keys = { controller: string; recovery: string; signingKey?: string };
const KEYS = 'did-example-keys';
const allKeys = (): Record<string, Keys> => JSON.parse(localStorage.getItem(KEYS) ?? '{}');
const saveKeys = (contract: string, keys: Keys) => localStorage.setItem(KEYS, JSON.stringify({ ...allKeys(), [contract]: keys }));
let keys: Keys | undefined;

const secret = () => {
  if (!keys) throw new Error('this browser has no controller key for this DID');
  return fromHex(keys.controller);
};

function sign(digest: bigint[]) {
  const sk = scalarOf(secret());
  const pk = ecMulGenerator(sk);
  const nonce = scalarOf(new Uint8Array([...secret(), ...fromHex(digest.map((d) => d.toString(16).padStart(64, '0')).join(''))]));
  const announcement = ecMulGenerator(nonce);
  const challenge = schnorr.schnorrChallengeDigest(announcement.x, announcement.y, pk.x, pk.y, digest) % TWO_248;
  return { announcement, response: (nonce + challenge * sk) % JUBJUB_ORDER };
}

const compiledContract = (CompiledContract as any).make('did', DID.Contract).pipe(
  (CompiledContract as any).withWitnesses({
    localControllerPublicKey: ({ privateState }: any) => [privateState, ecMulGenerator(scalarOf(secret()))],
    localRecoveryAuthorityPublicKey: ({ privateState }: any) => [privateState, ecMulGenerator(scalarOf(fromHex(keys!.recovery)))],
    currentTimestamp: ({ privateState }: any) => [privateState, BigInt(Date.now())],
    getSchnorrReduction: ({ privateState }: any, h: bigint) => [privateState, [h / TWO_248, h % TWO_248]],
  }),
  (CompiledContract as any).withCompiledFileAssets('managed/DID'),
);

// The DID has no private state. midnight-js keeps the maintenance signing key here, and each insert needs it.
const privateStateProvider = {
  setContractAddress() {},
  set: async () => {},
  get: async () => ({}),
  setSigningKey: async (contract: string, key: string) => saveKeys(contract, { ...allKeys()[contract], signingKey: key }),
  getSigningKey: async (contract: string) => allKeys()[contract]?.signingKey ?? null,
};

let providers: any;

async function connect() {
  const api = await registerMidnightSnap({ snapId: SNAP_ID }).connect(NETWORK_ID);
  const config = await api.getConfiguration();
  const shielded = await api.getShieldedAddresses();
  setNetworkId(config.networkId);
  // The provider calls its `fetchFunc` as a method, and a browser's fetch then throws "Illegal invocation".
  const zkConfigProvider = new FetchZkConfigProvider(new URL('managed/DID/', location.href).href, { fetchFunc: (url, init) => fetch(url, init) });
  const walletProvider = {
    getCoinPublicKey: () => shielded.shieldedCoinPublicKey,
    getEncryptionPublicKey: () => shielded.shieldedEncryptionPublicKey,
    async balanceTx(tx: Transaction<any, any, any>) {
      const { tx: balanced } = await api.balanceUnsealedTransaction(toHex(tx.serialize()));
      return Transaction.deserialize('signature', 'proof', 'binding', fromHex(balanced));
    },
    async submitTx(tx: Transaction<any, any, any>) {
      await api.submitTransaction(toHex(tx.serialize()));
      return tx.identifiers().at(-1)!;
    },
  };
  providers = {
    publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri),
    zkConfigProvider,
    proofProvider: await dappConnectorProofProvider(api, zkConfigProvider, CostModel.initialCostModel()),
    privateStateProvider,
    walletProvider,
    midnightProvider: walletProvider,
  };
  log(`connected to ${config.networkId} (${(await api.getUnshieldedAddress()).unshieldedAddress})`);
  if (address.value) await refresh();
}

async function create() {
  const random = () => toHex(crypto.getRandomValues(new Uint8Array(32)));
  keys = { controller: random(), recovery: random() };
  const unproven = await createUnprovenDeployTxFromVerifierKeys(
    providers.zkConfigProvider,
    providers.walletProvider.getCoinPublicKey(),
    { compiledContract, privateStateId: 'did', initialPrivateState: {}, args: [] } as any,
    providers.walletProvider.getEncryptionPublicKey(),
  );
  // The state that deployContract would deploy, with fewer circuits.
  const full = [...(unproven.private.unprovenTx as any).intents.values()][0].actions[0].initialState as ContractState;
  const state = new ContractState();
  state.data = full.data;
  state.maintenanceAuthority = full.maintenanceAuthority;
  for (const op of DEPLOY_OPS) state.setOperation(op, full.operation(op)!);
  const deploy = new ContractDeploy(state);
  // Save the keys before the snap submits, so that a failure after the submit does not lose them.
  saveKeys(deploy.address, { ...keys, signingKey: unproven.private.signingKey as string });
  log('deploying… approve the balance request in MetaMask');
  const tx = (Transaction as any).fromParts(getNetworkId(), undefined, undefined, Intent.new(new Date(Date.now() + 3600_000)).addDeploy(deploy));
  const result = await submitTx(providers, { unprovenTx: tx });
  address.value = deploy.address;
  localStorage.setItem('did-address', address.value);
  log(`created did:midnight:${NETWORK_ID}:${deploy.address} in tx ${result.txId}`);
  await refresh();
}

/** Add the verifier key of `circuit` if the contract does not have it yet. The contract's maintenance key signs it. */
async function ensureCircuit(circuit: string) {
  const state = await providers.publicDataProvider.queryContractState(contract());
  if (state?.operation(circuit)) return;
  log(`adding the ${circuit} circuit… approve the balance request in MetaMask`);
  const result = await submitInsertVerifierKeyTx(providers, compiledContract, contract(), circuit as any, await providers.zkConfigProvider.getVerifierKey(circuit));
  log(`added ${circuit} in tx ${result.txId}`);
}

/** Sign the operation with the controller key and call it. `digest` and `args` get the DID's id and version. */
async function call(circuit: string, digest: (id: any, version: bigint) => bigint[], args: (signature: ReturnType<typeof sign>, version: bigint) => unknown[]) {
  await ensureCircuit(circuit);
  const { id, version } = await ledger();
  log(`calling ${circuit}… the snap proves, then asks to balance`);
  const result = await submitCallTx(providers, { compiledContract, contractAddress: contract(), privateStateId: 'did', circuitId: circuit, args: args(sign(digest(id, version)), version) } as any);
  log(`${circuit} in tx ${result.public.txId}, block ${result.public.blockHeight}`);
  await refresh();
}

const mutation = (exists: boolean) => (exists ? DID.MapMutation.Update : DID.MapMutation.Insert);

async function addMethod() {
  const method = {
    id: $<HTMLInputElement>('methodId').value.trim(),
    typ: DID.VerificationMethodType.JsonWebKey,
    publicKeyJwk: { kty: DID.KeyType.OKP, crv: DID.CurveType.Ed25519, x: $<HTMLInputElement>('methodX').value.trim(), y: '' },
  };
  const m = mutation((await ledger()).verificationMethods.member(method.id));
  await call('setVerificationMethod', (id, v) => DID.pureCircuits.setVerificationMethodAuthorizationDigest(id, v, method, m), (s, v) => [method, m, s, v]);
}

async function removeMethod() {
  const methodId = $<HTMLInputElement>('methodId').value.trim();
  await call('removeVerificationMethod', (id, v) => DID.pureCircuits.removeVerificationMethodAuthorizationDigest(id, v, methodId), (s, v) => [methodId, s, v]);
}

async function setService() {
  const service = { id: $<HTMLInputElement>('serviceId').value.trim(), typ: $<HTMLInputElement>('serviceType').value.trim(), serviceEndpoint: $<HTMLInputElement>('serviceEndpoint').value.trim() };
  const m = mutation((await ledger()).services.member(service.id));
  await call('setService', (id, v) => DID.pureCircuits.setServiceAuthorizationDigest(id, v, service, m), (s, v) => [service, m, s, v]);
}

async function deactivate() {
  await call('deactivate', (id, v) => DID.pureCircuits.deactivateAuthorizationDigest(id, v), (s, v) => [s, v]);
}

const contract = () => address.value.trim();

async function ledger() {
  const state = await providers.publicDataProvider.queryContractState(contract());
  if (!state) throw new Error('no contract at this address');
  return DID.ledger(state.data);
}

async function refresh() {
  keys = allKeys()[contract()];
  const l = await ledger();
  const doc = {
    id: `did:midnight:${NETWORK_ID}:${contract()}`,
    version: l.version,
    active: l.active,
    verificationMethods: [...l.verificationMethods].map(([id, m]) => ({ id, x: m.publicKeyJwk.x })),
    services: [...l.services].map(([, s]) => s),
    controllerKeyInThisBrowser: !!keys,
  };
  $('doc').textContent = JSON.stringify(doc, (_, v) => (typeof v === 'bigint' ? String(v) : v), 2);
}

/** Run one action at a time and log its duration or error. */
function action(fn: () => Promise<void>) {
  return async () => {
    const started = Date.now();
    buttons.forEach((b) => (b.disabled = true));
    try {
      await fn();
      log(`${fn.name} done in ${((Date.now() - started) / 1000).toFixed(1)} s`);
    } catch (e: any) {
      console.error(e);
      // midnight-js wraps errors, and a connector APIError puts its text in `code` and `reason`.
      const describe = (x: any) => (x?.code ? `${x.code}: ${x.reason}` : x?.message || String(x));
      const causes = [];
      for (let c = e?.cause; c; c = c.cause) causes.push(describe(c));
      log(`${fn.name} FAILED: ${describe(e)}${causes.map((c) => `\n  caused by: ${c}`).join('')}`);
    } finally {
      buttons.forEach((b) => (b.disabled = b.id !== 'connect' && !providers));
    }
  };
}

address.value = localStorage.getItem('did-address') ?? '';
[connect, create, addMethod, removeMethod, setService, deactivate, refresh].forEach((fn) => ($(fn.name).onclick = action(fn)));
