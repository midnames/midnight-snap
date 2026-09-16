import * as Rx from "rxjs";
import { Box, Heading, Row, Text } from "@metamask/snaps-sdk/jsx";
import * as ledger from "@midnightntwrk/ledger-v9";
import { WalletFacade, WalletEntrySchema, type BalancingRecipe, type FacadeState } from "@midnightntwrk/wallet-sdk-facade";
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
import type { DustCatchUpAnchor } from "./fastsync/dustCatchUp";
import { findDustAlignment } from "./fastsync/dustQueries";
import { makeHttp } from "./fastsync/indexerClient";
import { DEFAULT_PROVING_SERVER_URL, getState, NETWORK, PROVING_PARAMS_URL, REQUEST_BUDGET_MS, setState, type Network } from "./config";
import { deriveKeys, type Keys } from "./keys";
import { provingService, provingConfig } from "./proving/browserProving";
import { dust, night, tokenAmount } from "./units";

/** Wallet state for one network, in snap state at `wallets.<networkId>`. */
type Persisted = {
  shielded: string;
  unshielded: string;
  dust: string;
  savedAt: number;
  dustAnchor?: DustCatchUpAnchor | null;
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
  /** Dust catch-up runs only after a gap longer than this. For short gaps the stock restore is faster. */
  dustCatchUpMinGapMs: number;
  /** "browser" proves in the snap. "server" sends the proof preimages to `provingServerUrl`. */
  provingStrategy: "server" | "browser";
  provingServerUrl: string;
  /** Base URL for proving keys and SRS. The host must send `Access-Control-Allow-Origin`. */
  provingParamsUrl: string;
};
const DEFAULT_SYNC_OPTIONS: SyncOptions = {
  shieldedFast: false,
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

const httpUrl = (name: string, value: unknown) => {
  let url: URL;
  try {
    url = new URL(String(value).trim());
  } catch {
    throw new Error(`${name} is not a URL: "${String(value)}"`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error(`${name} must be an http(s) URL`);
  return url.toString().replace(/\/$/, "");
};

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
  let anchor = saved?.dustAnchor ?? null;
  const catchUp = !!anchor && gapMs > opts.dustCatchUpMinGapMs;
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
        origin: origin?.dust ?? null,
        catchUp: catchUp
          ? {
              anchor: anchor!,
              dustAddress: DustAddress.encodePublicKey(network.networkId, keys.dustSecretKey.publicKey),
              onResult: (r: { anchor: DustCatchUpAnchor; spendsApplied: number; generationsAdded: number; roundTrips: number; elapsedMs: number }) => {
                anchor = r.anchor;
                void trace(`dust catch-up: ${r.spendsApplied} spends, ${r.generationsAdded} generations, ${r.roundTrips} round trips, ${r.elapsedMs}ms`);
              },
            }
          : null,
      } as never);
      return saved ? w.restore(saved.dust) : w.startWithSecretKey(keys.dustSecretKey, ledger.LedgerParameters.initialParameters().dust);
    },
  });
  await facade.start(keys.shieldedSecretKeys, keys.dustSecretKey);
  await trace(`open: shielded=${shieldedMode}${shieldedSaved ? " restored" : " fresh"} dust=${catchUp ? "catch-up" : origin ? "origin" : "stock"} gap=${Math.round(gapMs / 1000)}s`);

  try {
    const state = await syncFor(facade, deadline - Date.now());
    if (requireSynced && !state.isSynced) throw new Error("wallet is not synced yet; sync, then try again");
    return await fn({ facade, keys, state, network });
  } finally {
    anchor ??= await bootstrapAnchor(facade, network.indexerHttpUrl).catch(async (e) => {
      await trace(`dust anchor error: ${String(e)}`);
      return null;
    });
    const wallet: Persisted = {
      shielded: await facade.shielded.serializeState(),
      unshielded: await facade.unshielded.serializeState(),
      dust: await facade.dust.serializeState(),
      savedAt: Date.now(),
      dustAnchor: anchor,
      shieldedMode,
      txHistory: await txHistory.serialize().catch(() => undefined),
      pending: await Rx.firstValueFrom(facade.state())
        // Only the entries without a result. Sync clears a transaction that it sees on chain, and a restored one is
        // not seen again, so a resolved entry would come back in every session.
        .then((st) => st.pending.all.filter((item) => !("result" in item) || item.result === undefined).map((item) => hex.encode(item.tx.serialize())))
        .catch(() => saved?.pending),
    };
    await setState(`wallets.${network.networkId}`, wallet);
    await facade.stop().catch(() => undefined);
  }
}

/**
 * First anchor for dust catch-up. Catch-up only moves an existing anchor forward. The indexer's latest
 * dust alignment is a valid anchor only when the saved dust trees end at the same positions.
 */
async function bootstrapAnchor(facade: WalletFacade, indexerHttpUrl: string): Promise<DustCatchUpAnchor | null> {
  const st = await Rx.firstValueFrom(facade.state());
  if (!st.isSynced) return null;
  const d = st.dust as any;
  const local = (d.state?.state ?? d.state) as ledger.DustLocalState | undefined; // DustWalletState.state is the CoreWallet.
  if (typeof local?.commitmentTreeFirstFree !== "bigint") return null;
  const a = await findDustAlignment(makeHttp(indexerHttpUrl));
  if (!a) return null;
  if (BigInt(a.commitmentFrontier) !== local.commitmentTreeFirstFree || BigInt(a.generationFrontier) !== local.generatingTreeFirstFree) return null;
  await trace(`dust anchor at block ${a.blockHeight}`);
  return { blockHeight: a.blockHeight, generationFrontier: a.generationFrontier, commitmentFrontier: a.commitmentFrontier };
}

/** Wait for a synced state, or until the budget ends. Returns the last state. */
export function syncFor(facade: WalletFacade, budgetMs: number) {
  const deadline = Date.now() + budgetMs;
  return Rx.firstValueFrom(
    facade.state().pipe(
      Rx.throttleTime(3_000, undefined, { leading: true, trailing: true }),
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
    await facade.validateTransaction(tx, {
      flags: { enforceBalancing: true, verifySignatures: true, enforceLimits: true },
      ...((recipe as any).blockData ? { blockData: (recipe as any).blockData } : {}),
    } as any);
    return tx;
  } catch (e) {
    await trace(`finalize failed, coins released: ${String((e as Error)?.message ?? e)}`);
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

export function summarize({ shielded, unshielded, dust, isSynced }: FacadeState, keys: Keys, networkId: string) {
  const sp = shielded.progress as any, up = unshielded.progress as any, dp = dust.progress as any;
  return {
    synced: isSynced,
    shielded: {
      address: addressesFromKeys(keys, networkId).shielded,
      balances: strings(shielded.balances),
      coins: shielded.availableCoins.length,
      progress: { applied: String(sp?.appliedIndex), highest: String(sp?.highestIndex), connected: !!sp?.isConnected },
    },
    unshielded: {
      balances: strings(unshielded.balances),
      utxos: unshielded.availableCoins.length,
      progress: { applied: String(up?.appliedId), highest: String(up?.highestTransactionId), connected: !!up?.isConnected },
    },
    dust: {
      spendable: sum(dust.availableCoins.map((c) => c.generatedNow)).toString(),
      coins: dust.availableCoins.length,
      progress: { applied: String(dp?.appliedIndex), highest: String(dp?.highestIndex), connected: !!dp?.isConnected },
    },
    nativeToken: ledger.nativeToken().raw,
  };
}

/** What the home page shows, in snap state at `homes.<networkId>`. */
export type HomeSummary = { at: number; synced: boolean; unshielded: string; shielded: string; dust: string; names?: string[] };

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
        const home: HomeSummary = {
          at: Date.now(),
          synced: summary.synced,
          shielded: sum(Object.values(state.shielded.balances)).toString(),
          unshielded: sum(Object.values(state.unshielded.balances)).toString(),
          dust: summary.dust.spendable,
          names: await namesOf(keys, network),
        };
        await setState(`homes.${network.networkId}`, home).catch(() => undefined);
        return { ...summary, elapsedMs: Date.now() - t0 };
      },
      { requireSynced: false },
    );
  } catch (e) {
    return { synced: false, error: String(e), elapsedMs: Date.now() - t0 };
  }
}

/** MidNS names that point to or are owned by this account. The home page shows them. Undefined if the lookup fails. */
async function namesOf(keys: Keys, network: Network) {
  if (!network.midns) return undefined;
  try {
    return (await loadMidns(network)).namesFor([keys.unshieldedKeystore.getAddress(), keys.shieldedSecretKeys.coinPublicKey]);
  } catch (e) {
    await trace(`names lookup failed: ${String((e as Error)?.message ?? e)}`);
    return undefined;
  }
}

/** `to` is an address, or a MidNS name such as `alice.night`. */
export type TransferParams = { type: "shielded" | "unshielded"; to: string; amount: string; token?: string };

export async function transfer(p: TransferParams) {
  if (p?.type !== "shielded" && p?.type !== "unshielded") throw new Error("params.type must be 'shielded' | 'unshielded'");
  const amount = BigInt(p.amount);
  if (amount <= 0n) throw new Error("amount must be > 0");
  const native = ledger.nativeToken().raw;
  const token = p.token ?? native;
  // Resolve a name before the wallet opens: a name that does not resolve must not cost a sync.
  const name = isName(String(p.to).trim().toLowerCase()) ? String(p.to).trim().toLowerCase() : undefined;
  let to = p.to;
  if (name) {
    const record = (await loadMidns(NETWORK)).resolve(name);
    const resolved = p.type === "shielded" ? record.shielded : record.unshielded;
    if (!resolved) throw new Error(`${name} has no ${p.type} address (its target is a ${record.target.kind} ${record.target.kind === "contract" ? "address" : "key"})`);
    to = resolved;
  }
  const receiverAddress = parseRecipient(p.type, to);
  const t0 = Date.now();
  await trace(`transfer start ${p.type} ${amount} -> ${(name ?? to).slice(0, 24)}`);

  return withWallet(REQUEST_BUDGET_MS - 90_000, async (s) => {
    const recipe = await s.facade.transferTransaction(
      [{ type: p.type, outputs: [{ type: token, receiverAddress, amount }] } as any],
      secretKeys(s.keys),
      { ttl: ttl(), payFees: true },
    );
    await trace("recipe built");
    const fee = await s.facade.calculateTransactionFee(recipe.transaction);
    const ok = await confirm(`Send on Midnight ${s.network.networkId}`, [
      ["Kind", p.type],
      ...(name ? ([["To", name], ["Address", to]] as Array<[string, string]>) : ([["To", to]] as Array<[string, string]>)),
      ["Amount", `${amount} (${token === native ? "NIGHT atomic units" : token})`],
      ["Fee", `${fee} Specks (DUST)`],
    ]);
    if (!ok) {
      await s.facade.revert(recipe).catch(() => undefined);
      throw new Error("user rejected");
    }
    await trace("confirmed by user");
    const tx = await finalize(s, recipe);
    const txId = await s.facade.submitTransaction(tx).catch(async (e) => {
      await s.facade.revertTransaction(tx).catch(() => undefined); // Release the booked coins, as the connector's submit does.
      throw e;
    });
    await trace(`submitted ${txId}`);
    return { txId, to, fee: fee.toString(), elapsedMs: Date.now() - t0 };
  });
}

/** Register the unregistered NIGHT UTXOs for DUST generation. Fees are paid in DUST. */
export async function registerDust() {
  const t0 = Date.now();
  return withWallet(REQUEST_BUDGET_MS - 100_000, async ({ facade, keys, state }) => {
    const utxos = state.unshielded.availableCoins;
    if (utxos.length === 0) throw new Error("no NIGHT UTXOs; fund the unshielded address first");
    const unregistered = utxos.filter((u) => !u.meta.registeredForDustGeneration);
    if (unregistered.length === 0) return { registered: 0, alreadyRegistered: utxos.length, elapsedMs: Date.now() - t0 };

    const { fee } = await facade.estimateRegistration(unregistered);
    const ok = await confirm("Register NIGHT for DUST generation", [
      ["UTXOs", String(unregistered.length)],
      ["NIGHT", night(sum(unregistered.map((u) => u.utxo.value)))],
      ["Fee", dust(fee)],
    ]);
    if (!ok) throw new Error("user rejected");
    await facade.waitForGeneratedDust(unregistered, fee, { timeoutMs: 60_000 });
    const recipe = await facade.registerNightUtxosForDustGeneration(unregistered, keys.unshieldedKeystore.getPublicKey(), keys.unshieldedKeystore.signDataAsync);
    const txId = await facade.submitTransaction(await facade.finalizeRecipe(recipe));
    return { txId, registered: unregistered.length, fee: fee.toString(), elapsedMs: Date.now() - t0 };
  });
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
