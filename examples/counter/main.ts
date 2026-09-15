// A minimal dApp: deploy the Counter contract and call `increment` through the Midnight Snap.
// The snap balances, proves and submits. The page only builds transactions and reads the indexer.
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { deployContract, submitCallTx } from '@midnight-ntwrk/midnight-js-contracts';
import { dappConnectorProofProvider } from '@midnight-ntwrk/midnight-js-dapp-connector-proof-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { CostModel, Transaction } from '@midnightntwrk/ledger-v9';
import { registerMidnightSnap } from '../../connector/src/index.ts';
import * as Counter from './managed/contract/index.js';

const NETWORK_ID = 'stagenet';
const SNAP_ID = new URLSearchParams(location.search).get('snap') ?? 'local:http://localhost:8093';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const address = $<HTMLInputElement>('address');
const buttons = ['connect', 'deploy', 'increment', 'refresh'].map((id) => $<HTMLButtonElement>(id));
const log = (line: string) => ($('log').textContent += `${new Date().toLocaleTimeString()}  ${line}\n`);

const toHex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (hex: string) => Uint8Array.from(hex.match(/../g) ?? [], (b) => parseInt(b, 16));

const compiledContract = (CompiledContract as any)
  .make('counter', Counter.Contract)
  .pipe(CompiledContract.withVacantWitnesses, (CompiledContract as any).withCompiledFileAssets('managed'));

// In memory, so the deploy's maintenance signing key is lost on reload. Counter has no private state.
const memory = new Map<string, unknown>();
const privateStateProvider = {
  setContractAddress() {},
  set: async (id: string, state: unknown) => void memory.set(id, state),
  get: async (id: string) => memory.get(id) ?? null,
  setSigningKey: async (contract: string, key: unknown) => void memory.set(`signing:${contract}`, key),
  getSigningKey: async (contract: string) => memory.get(`signing:${contract}`) ?? null,
};

let providers: any;

/** Log the start and duration of one snap step, so a failure shows where it happened. */
const step =
  <A extends unknown[], R>(name: string, fn: (...args: A) => Promise<R>) =>
  async (...args: A): Promise<R> => {
    const started = Date.now();
    log(`  ${name}…`);
    const result = await fn(...args);
    log(`  ${name} took ${((Date.now() - started) / 1000).toFixed(1)} s`);
    return result;
  };

async function connect() {
  const api = await registerMidnightSnap({ snapId: SNAP_ID }).connect(NETWORK_ID);
  const config = await api.getConfiguration();
  const shielded = await api.getShieldedAddresses();
  setNetworkId(config.networkId);

  // The provider calls its `fetchFunc` as a method, and a browser's fetch then throws "Illegal invocation".
  const zkConfigProvider = new FetchZkConfigProvider(new URL('managed/', location.href).href, { fetchFunc: (url, init) => fetch(url, init) });
  const walletProvider = {
    getCoinPublicKey: () => shielded.shieldedCoinPublicKey,
    getEncryptionPublicKey: () => shielded.shieldedEncryptionPublicKey,
    async balanceTx(tx: Transaction<any, any, any>) {
      // Kept for a replay outside MetaMask: copy(window.lastUnsealedTx) in the console.
      const unsealed = ((window as any).lastUnsealedTx = toHex(tx.serialize()));
      const { tx: balanced } = await api.balanceUnsealedTransaction(unsealed);
      return Transaction.deserialize('signature', 'proof', 'binding', fromHex(balanced));
    },
    async submitTx(tx: Transaction<any, any, any>) {
      await api.submitTransaction(toHex(tx.serialize()));
      return tx.identifiers().at(-1)!;
    },
  };
  const proofProvider = await dappConnectorProofProvider(api, zkConfigProvider, CostModel.initialCostModel());
  providers = {
    publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri),
    zkConfigProvider,
    proofProvider: { proveTx: step('prove in snap', proofProvider.proveTx.bind(proofProvider)) },
    privateStateProvider,
    walletProvider: { ...walletProvider, balanceTx: step('balance in snap', walletProvider.balanceTx), submitTx: step('submit', walletProvider.submitTx) },
    midnightProvider: { ...walletProvider, submitTx: step('submit', walletProvider.submitTx) },
  };
  log(`connected to ${config.networkId} (${(await api.getUnshieldedAddress()).unshieldedAddress})`);
  if (address.value) await refresh();
}

async function deploy() {
  log('deploying… approve the balance request in MetaMask');
  const deployed = await deployContract(providers, { compiledContract } as any);
  address.value = deployed.deployTxData.public.contractAddress;
  localStorage.setItem('counter-address', address.value);
  log(`deployed ${address.value} in tx ${deployed.deployTxData.public.txId}`);
  await refresh();
}

async function increment() {
  log('calling increment… the snap proves, then asks to balance');
  const result = await submitCallTx(providers, { compiledContract, contractAddress: address.value.trim(), circuitId: 'increment', args: [] } as any);
  log(`increment in tx ${result.public.txId}, block ${result.public.blockHeight}`);
  await refresh();
}

async function refresh() {
  const state = await providers.publicDataProvider.queryContractState(address.value.trim());
  $('count').textContent = state ? String(Counter.ledger(state.data).round) : 'no contract at this address';
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

address.value = localStorage.getItem('counter-address') ?? '';
[connect, deploy, increment, refresh].forEach((fn) => ($(fn.name).onclick = action(fn)));
