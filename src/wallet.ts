import * as Rx from "rxjs";
import { Cause, Runtime } from "effect";
import { Box, Heading, Row, Text } from "@metamask/snaps-sdk/jsx";
import * as ledger from "@midnightntwrk/ledger-v9";
import { WalletFacade, WalletEntrySchema, type BalancingRecipe, type FacadeState, type WalletEntry } from "@midnightntwrk/wallet-sdk-facade";
import { InMemoryTransactionHistoryStorage } from "@midnightntwrk/wallet-sdk-abstractions";
import { ShieldedWallet } from "@midnightntwrk/wallet-sdk-shielded";
import { UnshieldedWallet, PublicKey } from "@midnightntwrk/wallet-sdk-unshielded-wallet";
import {
  DustAddress,
  MidnightBech32m,
  ShieldedAddress,
  ShieldedCoinPublicKey,
  ShieldedEncryptionPublicKey,
  UnshieldedAddress,
} from "@midnightntwrk/wallet-sdk-address-format";
import { bech32m, hex } from "@scure/base";
import { FastSyncDustWallet } from "./fastsync/dustWallet";
import { isName, loadMidns } from "./midns";
import { FastSyncShieldedWallet } from "./fastsync/shieldedWallet";
import { recordSyncOrigin, type WalletSyncOrigin } from "./fastsync/syncOrigin";
import { DEFAULT_PROVING_SERVER_URL, endpointUrl, getState, NETWORK, PROVING_PARAMS_URL, REQUEST_BUDGET_MS, setState, type Network } from "./config";
import { deriveKeys, type Keys } from "./keys";
import { provingService, provingConfig } from "./proving/browserProving";
import { dust, night, tokenAmount } from "./units";

/** Wallet state for one network, in snap state at `wallets.<networkId>`. */
type Persisted = {
  shielded: string;
  unshielded: string;
  dust: string;
  savedAt: number;
  /** A "fast" shielded state stores a zswap index as its offset, a "stock" state stores a ledger event id. */
  shieldedMode?: "fast" | "stock";
  txHistory?: unknown;
  /** Hex of the finalized transactions that the SDK still tracks: not on chain, not reverted. */
  pending?: string[];
};

// ---- settings (snap state `settings`) ----

export type SyncOptions = {
  /** Sync shielded coins through the indexer. The indexer receives the viewing key. */
  shieldedFast: boolean;
  /** A saved dust state is rebuilt only after a gap longer than this. For short gaps the stock restore is faster. */
  dustCatchUpMinGapMs: number;
  /** "browser" proves in the snap. "server" sends the proof preimages to `provingServerUrl`. */
  provingStrategy: "server" | "browser";
  provingServerUrl: string;
  /** Base URL for proving keys and SRS. The host must send `Access-Control-Allow-Origin`. */
  provingParamsUrl: string;
};
const DEFAULT_SYNC_OPTIONS: SyncOptions = {
  // The stock shielded sync of a new wallet replays every zswap event of the chain (52k on stagenet), and MetaMask stops
  // the snap before it ends. See src/fastsync/README.md.
  shieldedFast: true,
  dustCatchUpMinGapMs: 60 * 60_000,
  provingStrategy: "browser",
  provingServerUrl: DEFAULT_PROVING_SERVER_URL,
  provingParamsUrl: PROVING_PARAMS_URL,
};

/** Known keys only. `settings` also holds `networkId`, which only `setNetwork` can change. */
const pickOptions = (o: unknown): Partial<SyncOptions> => {
  const src = (o && typeof o === "object" ? o : {}) as Record<string, unknown>;
  return Object.fromEntries(Object.keys(DEFAULT_SYNC_OPTIONS).filter((k) => src[k] !== undefined).map((k) => [k, src[k]]));
};

const httpUrl = (name: string, value: unknown) => endpointUrl(name, value, ["http:", "https:"]);

/** Any site can call `midnight_setSyncOptions`, so validate here. */
export function validSyncOptionsPatch(patch: unknown): Partial<SyncOptions> {
  const out = pickOptions(patch);
  if (out.provingStrategy !== undefined && out.provingStrategy !== "browser" && out.provingStrategy !== "server") {
    throw new Error('provingStrategy must be "browser" or "server"');
  }
  if (out.provingServerUrl !== undefined) out.provingServerUrl = httpUrl("provingServerUrl", out.provingServerUrl);
  if (out.provingParamsUrl !== undefined) out.provingParamsUrl = httpUrl("provingParamsUrl", out.provingParamsUrl);
  if (out.shieldedFast !== undefined && typeof out.shieldedFast !== "boolean") throw new Error("shieldedFast must be a boolean");
  if (out.dustCatchUpMinGapMs !== undefined && !(Number.isFinite(out.dustCatchUpMinGapMs) && out.dustCatchUpMinGapMs >= 0)) {
    throw new Error("dustCatchUpMinGapMs must be a non-negative number");
  }
  return out;
}

export async function getSyncOptions(): Promise<SyncOptions> {
  const o = { ...DEFAULT_SYNC_OPTIONS, ...pickOptions(await getState("settings")) };
  provingConfig.paramsUrl = o.provingParamsUrl; // Both proving paths read the options through this function.
  return o;
}

/** Stores only the keys that are set. A stored default would keep an install on an old default. */
export async function setSyncOptions(patch: unknown): Promise<SyncOptions> {
  for (const [k, v] of Object.entries(validSyncOptionsPatch(patch))) await setState(`settings.${k}`, v);
  return getSyncOptions();
}

// ---- trace (snap state `trace`, kept after a crash) ----

export async function trace(line: string) {
  const log = (await getState<string[]>("trace")) ?? [];
  await setState("trace", [...log, `${new Date().toISOString().slice(11, 19)} ${line}`].slice(-40));
}

export const readTrace = async () => (await getState<string[]>("trace")) ?? [];

// ---- wallet session ----

export type Session = { facade: WalletFacade; keys: Keys; state: FacadeState; network: Network };

// One lock for all sessions, so requests wait for each other. Concurrent sessions would
// overwrite each other's saved state.
let lock: Promise<unknown> = Promise.resolve();
let sessions = 0;

/** True while a session runs or waits. Handlers with a 60 s limit must not wait for a long session. */
export const isWalletBusy = () => sessions > 0;

type Progress = { applied: string; highest: string; connected: boolean };
/** The sync progress of the open session, for `midnight_getSyncProgress`. Null when no session syncs. */
let progress: { startedAt: number; at: number; synced: boolean; shielded: Progress; unshielded: Progress; dust: Progress } | null = null;
export const syncProgress = () => progress;

/**
 * Open the wallet, sync, run `fn`, then save and close. One session at a time. A request that waits
 * too long fails: when MetaMask stops a request for time, it stops the snap and the running session.
 */
export function withWallet<T>(syncBudgetMs: number, fn: (s: Session) => Promise<T>, { requireSynced = true } = {}): Promise<T> {
  const network = NETWORK; // Grants and addresses were checked for this network.
  const deadline = Date.now() + syncBudgetMs; // The request timer starts now, not when the lock is free.
  const previous = lock;
  sessions++;
  const run = (async () => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const free = await Promise.race([
      previous.then(() => true),
      new Promise<boolean>((resolve) => (timer = setTimeout(resolve, Math.max(0, deadline - Date.now() - 15_000), false))),
    ]);
    clearTimeout(timer);
    if (!free) throw new Error("the wallet is busy with another request; try again later");
    return session(network, deadline, fn, requireSynced);
  })().finally(() => sessions--);
  lock = Promise.allSettled([previous, run]); // A request that stopped waiting does not release the lock.
  return run;
}

async function session<T>(network: Network, deadline: number, fn: (s: Session) => Promise<T>, requireSynced: boolean): Promise<T> {
  const keys = await deriveKeys(network.networkId);
  const saved = await getState<Persisted>(`wallets.${network.networkId}`);
  const origin = (await getState<WalletSyncOrigin>(`syncOrigins.${network.networkId}`)) ?? null;
  const opts = await getSyncOptions();
  const shieldedMode = opts.shieldedFast ? "fast" : "stock";
  const txHistory = saved?.txHistory
    ? InMemoryTransactionHistoryStorage.restore(saved.txHistory as any, WalletEntrySchema as any)
    : new InMemoryTransactionHistoryStorage(WalletEntrySchema as any);
  const gapMs = saved ? Date.now() - saved.savedAt : 0;
  // A new wallet always rebuilds: the stock sync replays every dust event of the chain, too many for MetaMask.
  const rebuild = !saved || gapMs > opts.dustCatchUpMinGapMs;
  // A saved shielded state from the other mode has an incompatible offset. Sync shielded again from zero.
  const shieldedSaved = saved && (saved.shieldedMode ?? "stock") === shieldedMode ? saved.shielded : null;
  const Shielded = opts.shieldedFast ? FastSyncShieldedWallet : ShieldedWallet;

  const facade = await WalletFacade.init({
    configuration: {
      networkId: network.networkId,
      indexerClientConnection: { indexerHttpUrl: network.indexerHttpUrl, indexerWsUrl: network.indexerWsUrl },
      provingServerUrl: new URL(opts.provingServerUrl),
      relayURL: new URL(network.nodeWsUrl),
      costParameters: { feeBlocksMargin: network.feeBlocksMargin },
      txHistoryStorage: txHistory,
    } as any,
    ...(opts.provingStrategy === "browser" ? { provingService } : {}),
    // The SDK tracks a transaction from submit (and from balancing, see `balance` in connector.ts) until it is on
    // chain, and when its TTL passes it reverts it, which releases the coins that it booked. A session lasts one
    // request, so without the saved list a transaction that never lands keeps its coins booked for ever.
    // A restored entry gets a new creation time. The TTLs of its intents still limit it, and a transaction that pays
    // DUST fees always has an intent.
    pendingTransactionsService: async (cfg) => {
      // The facade's own default. It is private only in the types.
      const service = await (WalletFacade as any).makeDefaultPendingTransactionsService(cfg);
      for (const tx of saved?.pending ?? []) {
        try {
          await service.addPendingTransaction(ledger.Transaction.deserialize("signature", "proof", "binding", hex.decode(tx)) as never);
        } catch {
          // A damaged entry must not stop the wallet from opening.
        }
      }
      return service;
    },
    shielded: (cfg) => {
      const w = Shielded({ ...(cfg as object), ...(opts.shieldedFast && origin ? { connectStartIndex: origin.zswapIndex } : {}) } as never);
      return shieldedSaved ? w.restore(shieldedSaved) : w.startWithSecretKeys(keys.shieldedSecretKeys);
    },
    unshielded: (cfg) => {
      const w = UnshieldedWallet(cfg as never);
      return saved ? w.restore(saved.unshielded) : w.startWithPublicKey(PublicKey.fromKeyStore(keys.unshieldedKeystore));
    },
    dust: (cfg) => {
      const w = FastSyncDustWallet({
        ...(cfg as object),
        rebuild: rebuild
          ? {
              dustAddress: DustAddress.encodePublicKey(network.networkId, keys.dustSecretKey.publicKey),
              onResult: (r: { blockHeight: number; outputs: number; spends: number; elapsedMs: number }) =>
                void trace(`dust rebuild at block ${r.blockHeight}: ${r.outputs} outputs, ${r.spends} spends, ${r.elapsedMs}ms`),
              onError: (e: unknown) => void trace(`dust rebuild failed, stock sync: ${describe(e)}`),
            }
          : null,
      } as never);
      return saved ? w.restore(saved.dust) : w.startWithSecretKey(keys.dustSecretKey, ledger.LedgerParameters.initialParameters().dust);
    },
  });
  await facade.start(keys.shieldedSecretKeys, keys.dustSecretKey);
  await trace(`open: shielded=${shieldedMode}${shieldedSaved ? " restored" : " fresh"} dust=${rebuild ? "rebuild" : "stock"} gap=${Math.round(gapMs / 1000)}s`);

  try {
    const state = await syncFor(facade, deadline - Date.now());
    if (requireSynced && !state.isSynced) throw new Error("wallet is not synced yet; sync, then try again");
    return await fn({ facade, keys, state, network });
  } finally {
    const wallet: Persisted = {
      shielded: await facade.shielded.serializeState(),
      unshielded: await facade.unshielded.serializeState(),
      dust: await facade.dust.serializeState(),
      savedAt: Date.now(),
      shieldedMode,
      txHistory: await txHistory.serialize().catch(() => undefined),
      pending: await Rx.firstValueFrom(facade.state())
        // Only the entries without a result. Sync clears a transaction that it sees on chain, and a restored one is
        // not seen again, so a resolved entry would come back in every session.
        .then((st) => st.pending.all.filter((item) => !("result" in item) || item.result === undefined).map((item) => hex.encode(item.tx.serialize())))
        .catch(() => saved?.pending),
    };
    await setState(`wallets.${network.networkId}`, wallet);
    // Each operation changes balances, so the summary is new after each session. Only a sync looks up names.
    const last = await Rx.firstValueFrom(facade.state()).catch(() => undefined);
    if (last) {
      const previous = await getState<HomeSummary>(`homes.${network.networkId}`);
      await setState(`homes.${network.networkId}`, { ...homeSummary(last), names: previous?.names }).catch(() => undefined);
    }
    progress = null;
    await facade.stop().catch(() => undefined);
  }
}

/** Wait for a synced state, or until the budget ends. Returns the last state. */
export function syncFor(facade: WalletFacade, budgetMs: number) {
  const deadline = Date.now() + budgetMs;
  const startedAt = Date.now();
  return Rx.firstValueFrom(
    facade.state().pipe(
      Rx.throttleTime(3_000, undefined, { leading: true, trailing: true }),
      Rx.tap((s) => {
        const { shielded, unshielded, dust } = progressOf(s);
        progress = { startedAt, at: Date.now(), synced: s.isSynced, shielded, unshielded, dust };
      }),
      Rx.filter((s) => s.isSynced || Date.now() > deadline),
      Rx.timeout({ first: Math.max(0, budgetMs) + 5_000, with: () => Rx.throwError(() => new Error("sync produced no state")) }),
    ),
  );
}

// ---- helpers shared by the RPC, the home page and the connector ----

export const confirm = (title: string, rows: Array<[string, string]>) =>
  snap.request({
    method: "snap_dialog",
    params: { type: "confirmation", content: Box({ children: [Heading({ children: title }), ...rows.map(([k, v]) => Row({ label: k, children: Text({ children: v }) }))] }) },
  });

export const secretKeys = (keys: Keys) => ({ shieldedSecretKeys: keys.shieldedSecretKeys, dustSecretKey: keys.dustSecretKey });
export const ttl = () => new Date(Date.now() + 60 * 60_000);

/** True if any intent acts on a deployed contract: a `ContractCall` or a `MaintenanceUpdate`. Only a `ContractDeploy` has an initial state. */
const usesAContract = (tx: unknown) =>
  [...((tx as { intents?: Map<unknown, { actions?: unknown[] }> }).intents?.values() ?? [])].some((intent) =>
    (intent.actions ?? []).some((action) => !!action && typeof action === "object" && !("initialState" in action)),
  );

/** Every part of an error: a ledger or effect error often has an empty `message` and keeps the reason in `cause`. */
export function describe(e: unknown, depth = 0): string {
  if (e === null || e === undefined) return String(e);
  // An effect FiberFailure keeps the reason in a symbol-keyed cause.
  if (Runtime.isFiberFailure(e)) return describe(Cause.squash(e[Runtime.FiberFailureCauseId]), depth);
  const error = e as { name?: string; message?: string; cause?: unknown; errors?: unknown[] };
  const head = [error.name, error.message || (depth === 0 ? String(e) : undefined)].filter(Boolean).join(": ");
  const nested = depth < 3 ? [error.cause, ...(error.errors ?? [])].filter((c) => c !== undefined && c !== null).map((c) => describe(c, depth + 1)) : [];
  return [head || String(e), ...nested].filter(Boolean).join(" <- ").slice(0, 400);
}

/**
 * Sign and prove, then validate. Does not submit.
 * On failure, release the coins that the recipe booked. The session saves state also after an error, and the
 * SDK releases a booked coin only on revert or when its spend is on chain, so the coins would stay booked.
 */
export async function finalize({ facade, keys }: Session, recipe: BalancingRecipe) {
  try {
    const signed = await facade.signRecipe(recipe, keys.unshieldedKeystore.signDataAsync);
    await trace("signed");
    const tx = await facade.finalizeRecipe(signed);
    await trace("proved");
    // The SDK validates against `LedgerState.blank`, which holds no contracts, so a transaction that calls or updates a
    // deployed contract always fails there with "call to non-existant contract". Such a transaction is for the node to judge.
    if (usesAContract(tx)) {
      await trace("validation skipped: the transaction uses a deployed contract");
    } else {
      await facade.validateTransaction(tx, {
        flags: { enforceBalancing: true, verifySignatures: true, enforceLimits: true },
        ...((recipe as any).blockData ? { blockData: (recipe as any).blockData } : {}),
      } as any);
      await trace("validated");
    }
    return tx;
  } catch (e) {
    await trace(`finalize failed, coins released: ${describe(e)}`);
    await facade.revert(recipe).catch(() => undefined);
    throw e;
  }
}

/** `MidnightBech32m.parse` has a 90-character limit, and shielded addresses are longer. */
export function parseRecipient(kind: "shielded" | "unshielded", addr: unknown) {
  const { prefix, words } = bech32m.decode(String(addr).trim() as `${string}1${string}`, false);
  const m = /^mn_([a-z-]+)_([a-z0-9-]+)$/.exec(prefix);
  if (!m) throw new Error(`not a Midnight address: prefix "${prefix}"`);
  const [, type, network] = m;
  if (network !== NETWORK.networkId) throw new Error(`address is for network "${network}", wallet is on "${NETWORK.networkId}"`);
  const parsed = new MidnightBech32m(type!, network, Buffer.from(bech32m.fromWords(words)));
  if (kind === "shielded") {
    if (type !== "shield-addr") throw new Error(`shielded transfer needs an mn_shield-addr_... address, got "${type}"`);
    return parsed.decode(ShieldedAddress, NETWORK.networkId);
  }
  if (type !== "addr") throw new Error(`unshielded transfer needs an mn_addr_... address, got "${type}"`);
  return parsed.decode(UnshieldedAddress, NETWORK.networkId);
}

export function addressesFromKeys(keys: Keys, networkId: string = NETWORK.networkId) {
  const z = keys.shieldedSecretKeys;
  const shielded = new ShieldedAddress(
    new ShieldedCoinPublicKey(Buffer.from(z.coinPublicKey, "hex")),
    new ShieldedEncryptionPublicKey(Buffer.from(z.encryptionPublicKey, "hex")),
  );
  return {
    shielded: MidnightBech32m.encode(networkId, shielded).toString(),
    unshielded: keys.unshieldedKeystore.getBech32Address().asString(),
    dustPublicKey: keys.dustSecretKey.publicKey.toString(16),
  };
}

const strings = (b: Record<string, bigint>) => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v.toString()]));
const sum = (values: Iterable<bigint>) => [...values].reduce((a, v) => a + v, 0n);

function progressOf({ shielded, unshielded, dust }: FacadeState) {
  const sp = shielded.progress as any, up = unshielded.progress as any, dp = dust.progress as any;
  return {
    shielded: { applied: String(sp?.appliedIndex), highest: String(sp?.highestIndex), connected: !!sp?.isConnected },
    unshielded: { applied: String(up?.appliedId), highest: String(up?.highestTransactionId), connected: !!up?.isConnected },
    dust: { applied: String(dp?.appliedIndex), highest: String(dp?.highestIndex), connected: !!dp?.isConnected },
  };
}

export function summarize(state: FacadeState, keys: Keys, networkId: string) {
  const { shielded, unshielded, dust, isSynced } = state;
  const p = progressOf(state);
  return {
    synced: isSynced,
    shielded: {
      address: addressesFromKeys(keys, networkId).shielded,
      balances: strings(shielded.balances),
      coins: shielded.availableCoins.length,
      progress: p.shielded,
    },
    unshielded: {
      balances: strings(unshielded.balances),
      utxos: unshielded.availableCoins.length,
      progress: p.unshielded,
    },
    dust: {
      spendable: sum(dust.availableCoins.map((c) => c.generatedNow)).toString(),
      coins: dust.availableCoins.length,
      progress: p.dust,
    },
    nativeToken: ledger.nativeToken().raw,
  };
}

/** What the home page shows, in snap state at `homes.<networkId>`. */
export type HomeSummary = {
  at: number;
  synced: boolean;
  unshielded: string;
  shielded: string;
  dust: string;
  /** Balance of each token type (raw hex) of each kind. Absent in summaries from older snap versions. */
  tokens?: { unshielded: Record<string, string>; shielded: Record<string, string> };
  /** DUST generation. Amounts in Specks. Absent in summaries from older snap versions. */
  dustDetail?: {
    generatedNow: string;
    maxCap: string;
    coins: Array<{ generatedNow: string; maxCap: string; maxCapReachedAt: string; decaying: boolean }>;
    /** The NIGHT UTXOs. Registered UTXOs generate DUST. */
    night: Array<{ value: string; registered: boolean }>;
  };
  names?: Array<{ name: string; did?: string }>;
};

/** The summary of a wallet state, without names. */
export function homeSummary(state: FacadeState): Omit<HomeSummary, "names"> {
  const coins = state.dust.availableCoins;
  return {
    at: Date.now(),
    synced: state.isSynced,
    shielded: sum(Object.values(state.shielded.balances)).toString(),
    unshielded: sum(Object.values(state.unshielded.balances)).toString(),
    dust: sum(coins.map((c) => c.generatedNow)).toString(),
    tokens: { unshielded: strings(state.unshielded.balances), shielded: strings(state.shielded.balances) },
    dustDetail: {
      generatedNow: sum(coins.map((c) => c.generatedNow)).toString(),
      maxCap: sum(coins.map((c) => c.maxCap)).toString(),
      coins: coins.map((c) => ({
        generatedNow: c.generatedNow.toString(),
        maxCap: c.maxCap.toString(),
        maxCapReachedAt: c.maxCapReachedAt.toISOString(),
        decaying: c.dtime !== undefined,
      })),
      night: state.unshielded.availableCoins.map((u) => ({ value: u.utxo.value.toString(), registered: u.meta.registeredForDustGeneration })),
    },
  };
}

// ---- operations ----

let syncInFlight: ReturnType<typeof syncOnce> | null = null;

/** A cron tick and a user request share one sync. */
export function sync() {
  return (syncInFlight ??= syncOnce().finally(() => (syncInFlight = null)));
}

async function syncOnce() {
  const t0 = Date.now();
  try {
    return await withWallet(
      REQUEST_BUDGET_MS - 20_000,
      async ({ keys, state, network }) => {
        const summary = summarize(state, keys, network.networkId);
        // The session saves the summary when it closes, with the names of the last summary.
        await setState(`homes.${network.networkId}`, { ...homeSummary(state), names: await namesOf(keys, network) }).catch(() => undefined);
        return { ...summary, elapsedMs: Date.now() - t0 };
      },
      { requireSynced: false },
    );
  } catch (e) {
    return { synced: false, error: String(e), elapsedMs: Date.now() - t0 };
  }
}

/** MidNS names that point to or are owned by this account, with their `did` field. Undefined if the lookup fails. */
async function namesOf(keys: Keys, network: Network) {
  if (!network.midns) return undefined;
  try {
    const midns = await loadMidns(network);
    return midns.namesFor([keys.unshieldedKeystore.getAddress(), keys.shieldedSecretKeys.coinPublicKey]).map((name) => {
      const did = midns.resolve(name).fields.did;
      return did ? { name, did } : { name };
    });
  } catch (e) {
    await trace(`names lookup failed: ${String((e as Error)?.message ?? e)}`);
    return undefined;
  }
}

/** One output of a transfer. `to` is an address, or a MidNS name such as `alice.night`. `token` is a raw token type. */
export type TransferOutput = { type: "shielded" | "unshielded"; to: string; amount: string; token?: string };
/** One output, or `outputs` for several outputs in one transaction. */
export type TransferParams = TransferOutput | { outputs: TransferOutput[] };

type Output = { kind: "shielded" | "unshielded"; token: string; amount: bigint; address: string; name?: string };

/** The transfers of `WalletFacade.transferTransaction`: one group for each kind. */
export function groupTransfers(outputs: Array<Omit<Output, "name">>) {
  return (["shielded", "unshielded"] as const)
    .map((type) => ({
      type,
      outputs: outputs.filter((o) => o.kind === type).map((o) => ({ type: o.token, receiverAddress: parseRecipient(type, o.address), amount: o.amount })),
    }))
    .filter((g) => g.outputs.length > 0);
}

/** Validate the outputs and resolve names before the wallet opens: a name that does not resolve must not cost a sync. */
async function resolveOutputs(p: TransferParams): Promise<Output[]> {
  const list = p && typeof p === "object" && "outputs" in p ? p.outputs : [p];
  if (!Array.isArray(list) || list.length === 0) throw new Error("params.outputs must be a non-empty array");
  const native = ledger.nativeToken().raw;
  let midns: Awaited<ReturnType<typeof loadMidns>> | undefined;
  const out: Output[] = [];
  for (const [i, o] of list.entries()) {
    const at = list.length > 1 ? `output ${i + 1}: ` : "";
    if (o?.type !== "shielded" && o?.type !== "unshielded") throw new Error(`${at}type must be 'shielded' | 'unshielded'`);
    if (!/^[0-9]+$/.test(String(o.amount)) || BigInt(o.amount) <= 0n) throw new Error(`${at}amount must be a whole number > 0`);
    const token = String(o.token ?? native).toLowerCase();
    if (!/^[0-9a-f]{64}$/.test(token)) throw new Error(`${at}token must be 32 bytes of hex`);
    const to = String(o.to ?? "").trim();
    let address = to;
    let name: string | undefined;
    if (isName(to.toLowerCase())) {
      name = to.toLowerCase();
      const record = (midns ??= await loadMidns(NETWORK)).resolve(name);
      const resolved = o.type === "shielded" ? record.shielded : record.unshielded;
      if (!resolved) throw new Error(`${at}${name} has no ${o.type} address (its target is a ${record.target.kind} ${record.target.kind === "contract" ? "address" : "key"})`);
      address = resolved;
    }
    try {
      parseRecipient(o.type, address);
    } catch (e) {
      throw new Error(`${at}${(e as Error).message}`);
    }
    out.push({ kind: o.type, token, amount: BigInt(o.amount), address, name });
  }
  return out;
}

/** Build the transfer and its fee. The recipe books coins: revert it if it is not submitted. */
async function buildTransfer(s: Session, outputs: Output[]) {
  const recipe = await s.facade.transferTransaction(groupTransfers(outputs) as any, secretKeys(s.keys), { ttl: ttl(), payFees: true });
  try {
    return { recipe, fee: await s.facade.calculateTransactionFee(recipe.transaction) };
  } catch (e) {
    await s.facade.revert(recipe).catch(() => undefined);
    throw e;
  }
}

/**
 * Prove and submit. On failure, release the coins that the recipe or the transaction booked: the session saves state
 * also after an error, and the SDK releases a booked coin only on revert or when its spend is on chain.
 * `sign: false` for recipes that are signed when they are made, such as DUST registrations.
 */
async function proveAndSubmit(s: Session, recipe: BalancingRecipe, { sign = true } = {}) {
  const tx = sign
    ? await finalize(s, recipe)
    : await s.facade.finalizeRecipe(recipe).catch(async (e) => {
        await s.facade.revert(recipe).catch(() => undefined);
        throw e;
      });
  const txId = await s.facade.submitTransaction(tx).catch(async (e) => {
    await s.facade.revertTransaction(tx).catch(() => undefined);
    throw e;
  });
  await trace(`submitted ${txId}`);
  return txId;
}

export async function transfer(p: TransferParams) {
  const outputs = await resolveOutputs(p);
  const t0 = Date.now();
  await trace(`transfer start, ${outputs.length} output(s), first to ${(outputs[0]!.name ?? outputs[0]!.address).slice(0, 24)}`);

  return withWallet(REQUEST_BUDGET_MS - 90_000, async (s) => {
    const { recipe, fee } = await buildTransfer(s, outputs);
    await trace("recipe built");
    const ok = await confirm(`Send on Midnight ${s.network.networkId}`, [
      ...outputs.flatMap((o, i): Array<[string, string]> => [
        [outputs.length > 1 ? `Output ${i + 1}` : "Kind", o.kind],
        ["To", o.name ? `${o.name} (${o.address})` : o.address],
        ["Amount", tokenAmount(o.amount, o.token)],
      ]),
      // A bound: the SDK prices the transaction for a fee rise over `feeBlocksMargin` blocks. The paid fee is lower.
      ["Fee, at most", dust(fee)],
    ]);
    if (!ok) {
      await s.facade.revert(recipe).catch(() => undefined);
      throw new Error("user rejected");
    }
    await trace("confirmed by user");
    const txId = await proveAndSubmit(s, recipe);
    return { txId, to: outputs.map((o) => o.address), fee: fee.toString(), elapsedMs: Date.now() - t0 };
  });
}

/**
 * The fee of a transfer, at most, without a dialog: the number that the confirmation shows. Opens the wallet to build
 * the transaction, then releases its coins.
 */
export async function estimateFee(p: TransferParams) {
  const outputs = await resolveOutputs(p);
  return withWallet(REQUEST_BUDGET_MS - 30_000, async (s) => {
    const { recipe, fee } = await buildTransfer(s, outputs);
    await s.facade.revert(recipe).catch(() => undefined);
    return { fee: fee.toString() };
  });
}

/** Register the unregistered NIGHT UTXOs for DUST generation. Fees are paid in DUST. */
export async function registerDust() {
  const t0 = Date.now();
  return withWallet(REQUEST_BUDGET_MS - 100_000, async (s) => {
    const utxos = s.state.unshielded.availableCoins;
    if (utxos.length === 0) throw new Error("no NIGHT UTXOs; fund the unshielded address first");
    const unregistered = utxos.filter((u) => !u.meta.registeredForDustGeneration);
    if (unregistered.length === 0) return { registered: 0, alreadyRegistered: utxos.length, elapsedMs: Date.now() - t0 };

    const { fee } = await s.facade.estimateRegistration(unregistered);
    const ok = await confirm("Register NIGHT for DUST generation", [
      ["UTXOs", String(unregistered.length)],
      ["NIGHT", night(sum(unregistered.map((u) => u.utxo.value)))],
      ["Fee", dust(fee)],
    ]);
    if (!ok) throw new Error("user rejected");
    await s.facade.waitForGeneratedDust(unregistered, fee, { timeoutMs: 60_000 });
    const recipe = await s.facade.registerNightUtxosForDustGeneration(unregistered, s.keys.unshieldedKeystore.getPublicKey(), s.keys.unshieldedKeystore.signDataAsync);
    const txId = await proveAndSubmit(s, recipe, { sign: false });
    return { txId, registered: unregistered.length, fee: fee.toString(), elapsedMs: Date.now() - t0 };
  });
}

/** Stop DUST generation for the registered NIGHT UTXOs. Their DUST then decays. */
export async function deregisterDust() {
  const t0 = Date.now();
  return withWallet(REQUEST_BUDGET_MS - 100_000, async (s) => {
    const registered = s.state.unshielded.availableCoins.filter((u) => u.meta.registeredForDustGeneration);
    if (registered.length === 0) return { deregistered: 0, elapsedMs: Date.now() - t0 };
    const recipe = await s.facade.deregisterFromDustGeneration(registered as any, s.keys.unshieldedKeystore.getPublicKey(), s.keys.unshieldedKeystore.signDataAsync);
    const fee = await s.facade.calculateTransactionFee(recipe.transaction).catch(() => undefined);
    const ok = await confirm("Stop DUST generation", [
      ["UTXOs", String(registered.length)],
      ["NIGHT", night(sum(registered.map((u) => u.utxo.value)))],
      ["Effect", "Your DUST stops growing and decays to zero. Transactions need DUST for fees."],
      ["Fee, at most", fee === undefined ? "unknown" : dust(fee)],
    ]);
    if (!ok) {
      await s.facade.revert(recipe).catch(() => undefined);
      throw new Error("user rejected");
    }
    const txId = await proveAndSubmit(s, recipe, { sign: false });
    return { txId, deregistered: registered.length, fee: fee?.toString(), elapsedMs: Date.now() - t0 };
  });
}

/** One transaction of the history, with the change of each token balance of this wallet (negative: sent). */
export type HistoryEntry = {
  hash: string;
  status: "pending" | "success" | "partial" | "failure" | "rejected";
  /** ISO time: of the block, of the submission, or of the rejection. */
  at: string | null;
  /** Specks (DUST). */
  fee: string | null;
  unshielded: Record<string, string>;
  shielded: Record<string, string>;
};

const deltas = (plus: ReadonlyArray<{ value: bigint; type: string }>, minus: ReadonlyArray<{ value: bigint; type: string }>) => {
  const out: Record<string, bigint> = {};
  for (const c of plus) out[c.type] = (out[c.type] ?? 0n) + c.value;
  for (const c of minus) out[c.type] = (out[c.type] ?? 0n) - c.value;
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== 0n).map(([k, v]) => [k, v.toString()]));
};

/** History entries of the SDK, newest first. */
export function historyEntries(all: readonly WalletEntry[]): HistoryEntry[] {
  const time = (e: WalletEntry) => {
    const l = e.lifecycle as any;
    return (l.finalizedBlock?.timestamp ?? l.submittedAt ?? l.rejectedAt ?? e.timestamp) as Date | undefined;
  };
  return all
    .map((e): HistoryEntry => {
      const u = e.unshielded, z = e.shielded;
      const status =
        e.lifecycle.status === "finalized"
          ? ({ SUCCESS: "success", PARTIAL_SUCCESS: "partial", FAILURE: "failure" } as const)[e.status ?? "SUCCESS"]
          : e.lifecycle.status;
      return {
        hash: e.hash,
        status,
        at: time(e)?.toISOString() ?? null,
        fee: e.fees === undefined || e.fees === null ? null : e.fees.toString(),
        unshielded: deltas(
          (u?.createdUtxos ?? []).map((c) => ({ value: c.value, type: c.tokenType })),
          (u?.spentUtxos ?? []).map((c) => ({ value: c.value, type: c.tokenType })),
        ),
        shielded: deltas(z?.receivedCoins ?? [], z?.spentCoins ?? []),
      };
    })
    .sort((a, b) => (b.at ?? "").localeCompare(a.at ?? ""));
}

/** The transaction history in the saved wallet state, newest first. Does not open the wallet. */
export async function history(page = 0, pageSize = 20): Promise<{ total: number; entries: HistoryEntry[] }> {
  const saved = await getState<Persisted>(`wallets.${NETWORK.networkId}`);
  if (!saved?.txHistory) return { total: 0, entries: [] };
  const entries = historyEntries((await InMemoryTransactionHistoryStorage.restore(saved.txHistory as any, WalletEntrySchema as any).getAll()) as WalletEntry[]);
  const size = Math.min(Math.max(1, Math.floor(pageSize)), 100);
  const start = Math.max(0, Math.floor(page)) * size;
  return { total: entries.length, entries: entries.slice(start, start + size) };
}

/**
 * Record the current chain position as the start of this account. Use only for an account that
 * never held funds: sync skips all history before this position.
 */
export async function markAccountAsNew() {
  const origin = await recordSyncOrigin(NETWORK.indexerHttpUrl);
  if (origin) await setState(`syncOrigins.${NETWORK.networkId}`, origin);
  return origin;
}

export const clearState = () => snap.request({ method: "snap_clearState", params: {} });
