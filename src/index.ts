import "./ws-shim"; // Must load before graphql-ws and @polkadot/x-ws read globalThis.WebSocket.
import type { OnCronjobHandler, OnRpcRequestHandler, OnWebSocketEventHandler } from "@metamask/snaps-sdk";
import { dispatchWebSocketEvent, wsStats, SnapWebSocket } from "./ws-shim";
import { connectorCall, decodeSignData, listGrants, revokeGrant, signedMessageBytes } from "./connector";
import { deriveKeys } from "./keys";
import { resolveDid } from "./did";
import { nightOf } from "./home";
import { night } from "./units";
import { loadMidns } from "./midns";
import { endpoints, getState, isNetworkId, loadNetwork, NETWORK, NETWORK_IDS, setEndpoints, setNetwork, validEndpointsPatch } from "./config";
import {
  addressesFromKeys,
  clearState,
  confirm,
  deregisterDust,
  estimateFee,
  getSyncOptions,
  history,
  isWalletBusy,
  markAccountAsNew,
  readTrace,
  registerDust,
  setSyncOptions,
  sync,
  syncProgress,
  trace,
  transfer,
  validSyncOptionsPatch,
  type HomeSummary,
  type TransferParams,
} from "./wallet";

export { onHomePage, onUserInput } from "./home";

/** Raw graphql-transport-ws handshake with the indexer through the shim. Does not open the wallet. */
async function diag(timeoutMs = 15_000) {
  const log: string[] = [];
  const t0 = Date.now();
  const stamp = (m: string) => log.push(`${Date.now() - t0}ms ${m}`);
  await new Promise<void>((resolve) => {
    const ws = new SnapWebSocket(NETWORK.indexerWsUrl, "graphql-transport-ws");
    const done = () => { try { ws.close(); } catch {} resolve(); };
    const timer = setTimeout(() => { stamp("timeout"); done(); }, timeoutMs);
    ws.onopen = () => { stamp("open"); ws.send(JSON.stringify({ type: "connection_init" })); };
    ws.onerror = (e: any) => stamp("error " + (e?.message ?? JSON.stringify(e)));
    ws.onclose = (e: any) => { stamp(`close ${e.code} ${e.reason}`); clearTimeout(timer); resolve(); };
    ws.onmessage = (e: any) => {
      stamp("message " + String(e.data).slice(0, 120));
      const msg = JSON.parse(String(e.data));
      if (msg.type === "connection_ack") {
        ws.send(JSON.stringify({ id: "1", type: "subscribe", payload: { query: "subscription { blocks { height } }" } }));
      } else if (msg.type === "next") { clearTimeout(timer); done(); }
    };
  });
  const fetchIndexer = await fetch(NETWORK.indexerHttpUrl, { method: "POST", headers: { "content-type": "application/json" }, body: '{"query":"{ block { height } }"}' })
    .then((r) => r.text())
    .catch((e) => "fetch error " + String(e));
  return { log, ws: wsStats, fetchIndexer };
}

/** True in builds made with SNAP_DEV_RPC=1 (snap.config.ts). */
declare const SNAP_DEV_RPC: boolean;
/** The wallet site, for example `https://wallet.midnames.com`. Set with SNAP_WALLET_ORIGIN at build time. Empty: none. */
declare const SNAP_WALLET_ORIGIN: string;

/** Debugging methods. Only development builds have them, also for the wallet site. */
const DEV_ONLY_METHODS = new Set(["midnight_diag", "midnight_trace"]);

/**
 * Every website can call this snap (`endowment:rpc.dapps: true`), and the manifest cannot allow
 * one method only. dApps use `midnight_connector`, which has per-origin grants. The other methods
 * are for the wallet site (SNAP_WALLET_ORIGIN) and, in development builds, for pages on localhost.
 * The home page has the same functions for users.
 */
function isLocalDevOrigin(origin: string) {
  try {
    const { protocol, hostname } = new URL(origin);
    return (protocol === "http:" || protocol === "https:") && (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]");
  } catch {
    return false;
  }
}

async function rejectUnlessConfirmed(title: string, rows: Array<[string, string]>) {
  if (!(await confirm(title, rows))) throw new Error("user rejected");
}

export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }): Promise<any> => {
  const params = (request.params ?? {}) as Record<string, any>;
  if (request.method === "midnight_connector") {
    await loadNetwork();
    return connectorCall(origin, params.method, params.args ?? "");
  }
  const isWalletSite = SNAP_WALLET_ORIGIN !== "" && origin === SNAP_WALLET_ORIGIN;
  if (!SNAP_DEV_RPC && (!isWalletSite || DEV_ONLY_METHODS.has(request.method))) throw new Error(`Method not found: ${request.method}`);
  if (!isWalletSite && !isLocalDevOrigin(origin)) {
    throw new Error(`${request.method} is only available to the wallet site and local development pages; dApps use midnight_connector`);
  }
  await loadNetwork();
  switch (request.method) {
    case "ping":
      return { ok: true, ts: Date.now(), network: NETWORK.networkId };
    case "midnight_getAccounts":
      return addressesFromKeys(await deriveKeys());
    case "midnight_sync":
      return sync();
    case "midnight_getSummary": // What the home page shows. Reads snap state only, so it does not wait for a sync.
      return (await getState<HomeSummary>(`homes.${NETWORK.networkId}`)) ?? null;
    case "midnight_transfer":
      return transfer(params as TransferParams);
    case "midnight_estimateFee":
      return estimateFee(params as TransferParams);
    case "midnight_registerDust":
      return registerDust();
    case "midnight_deregisterDust":
      return deregisterDust();
    case "midnight_getHistory":
      return history(Number(params.page ?? 0), Number(params.pageSize ?? 20));
    case "midnight_getSyncProgress": // Answers during a sync: requests run at the same time, only wallet sessions wait.
      return syncProgress();
    case "midnight_signData": {
      const bytes = decodeSignData(params.hex, "hex");
      const hex = String(params.hex);
      await rejectUnlessConfirmed(`Sign data for ${origin}`, [["Bytes", String(bytes.length)], ["Hex", hex.length > 64 ? `${hex.slice(0, 64)}…` : hex]]);
      const { unshieldedKeystore } = await deriveKeys();
      // Same prefix as the connector: this key also signs transactions.
      return { signature: unshieldedKeystore.signData(signedMessageBytes(bytes)), verifyingKey: unshieldedKeystore.getPublicKey() };
    }
    case "midnight_reset":
      await rejectUnlessConfirmed("Reset the Midnight Snap", [["Effect", "Deletes wallet state, settings and dApp connections. The next sync starts from zero."]]);
      await clearState();
      return { ok: true };
    case "midnight_recordSyncOrigin":
      await rejectUnlessConfirmed("Mark this Midnight account as new", [
        ["Effect", "Sync skips the chain history before now"],
        ["Warning", "Use only if this account never held funds. If it did, the balances will be wrong."],
      ]);
      return markAccountAsNew();
    case "midnight_diag":
      return diag();
    case "midnight_trace":
      return readTrace();
    case "midnight_resolveName":
      if (typeof params.name !== "string") throw new Error("params.name is required");
      return (await loadMidns(NETWORK)).resolve(params.name);
    case "midnight_resolveDid":
      if (typeof params.did !== "string") throw new Error("params.did is required");
      return resolveDid(NETWORK, params.did);
    case "midnight_getNetwork":
      return { networkId: NETWORK.networkId, available: NETWORK_IDS, endpoints: endpoints() };
    case "midnight_setEndpoints": {
      const next = validEndpointsPatch(params);
      const current = endpoints();
      const target = { indexerHttpUrl: next?.indexerHttpUrl ?? current.defaults.indexerHttpUrl, nodeWsUrl: next?.nodeWsUrl ?? current.defaults.nodeWsUrl };
      if (target.indexerHttpUrl === current.indexerHttpUrl && target.nodeWsUrl === current.nodeWsUrl) return { ...current, changed: false };
      await rejectUnlessConfirmed(`Change ${NETWORK.networkId} endpoints for ${origin}`, [
        ["Indexer", target.indexerHttpUrl],
        ["Node", target.nodeWsUrl],
        ["Privacy", "The indexer sees your addresses. With fast shielded sync it also gets your viewing key and sees your shielded history."],
      ]);
      await setEndpoints(next);
      return { ...endpoints(), changed: true };
    }
    case "midnight_setNetwork": {
      const { networkId } = params;
      if (networkId === NETWORK.networkId) return { networkId, changed: false };
      if (!isNetworkId(networkId)) throw new Error(`unknown network "${networkId}"; expected one of ${NETWORK_IDS.join(", ")}`);
      await rejectUnlessConfirmed("Switch Midnight network", [
        ["From", NETWORK.networkId],
        ["To", networkId],
        ["Effect", "Balances, addresses and dApp connections are per network"],
      ]);
      return { networkId: (await setNetwork(networkId)).networkId, changed: true };
    }
    case "midnight_getSites":
      return listGrants();
    case "midnight_revokeSite":
      if (!params.origin) throw new Error("params.origin is required");
      return { revoked: await revokeGrant(params.origin) };
    case "midnight_getSyncOptions":
      return getSyncOptions();
    case "midnight_setSyncOptions": {
      const patch = validSyncOptionsPatch(request.params);
      const current = await getSyncOptions();
      // The proving settings decide where proof preimages and key downloads go. The user must approve a change.
      const changed = (["provingStrategy", "provingServerUrl", "provingParamsUrl"] as const).filter((k) => patch[k] !== undefined && patch[k] !== current[k]);
      if (changed.length) await rejectUnlessConfirmed(`Change proving settings for ${origin}`, changed.map((k) => [k, String(patch[k])] as [string, string]));
      return setSyncOptions(patch);
    }
    default:
      throw new Error(`Method not found: ${request.method}`);
  }
};

export const onWebSocketEvent: OnWebSocketEventHandler = async ({ event }) => {
  dispatchWebSocketEvent(event);
};

/** Cron job: keep the saved state near the chain tip, so requests restore in seconds. The first sync is a user request. */
export const onCronjob: OnCronjobHandler = async ({ request }) => {
  if (request.method !== "backgroundSync") throw new Error(`Method not found: ${request.method}`);
  await loadNetwork();
  if (!(await getState(`wallets.${NETWORK.networkId}`))) {
    await trace("cron sync skipped: no wallet yet");
    return;
  }
  // A cron request has 60 s. If it waits for a long session and times out, MetaMask stops the snap.
  if (isWalletBusy()) {
    await trace("cron sync skipped: wallet busy");
    return;
  }
  const t0 = Date.now();
  const homeKey = `homes.${NETWORK.networkId}`;
  const before = await getState<HomeSummary>(homeKey);
  const r = await sync();
  await trace(`cron sync ${"error" in r ? `failed: ${r.error}` : r.synced ? "synced" : "partial"} ${Date.now() - t0}ms`);
  const after = await getState<HomeSummary>(homeKey);
  if (before && after && nightOf(after, "unshielded") !== nightOf(before, "unshielded")) {
    await snap.request({ method: "snap_notify", params: { type: "inApp", message: `Unshielded balance is now ${night(nightOf(after, "unshielded"))}` } }).catch(() => undefined);
  }
};
