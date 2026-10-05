import type { Json } from "@metamask/snaps-sdk";

const NETWORKS = {
  stagenet: {
    networkId: "stagenet",
    indexerHttpUrl: "https://indexer.stagenet.shielded.tools/api/v4/graphql",
    indexerWsUrl: "wss://indexer.stagenet.shielded.tools/api/v4/graphql/ws",
    nodeWsUrl: "wss://rpc.stagenet.shielded.tools",
    feeBlocksMargin: 100,
    /** MidNS contract (tld "night"). A test instance: its root domain secret is public, so anyone can manage names. */
    midns: "7aae593f1aa95aff7b67bd61ff86dc157e3c2d23be45559d0ff767e65ba068bd",
  },
  undeployed: {
    networkId: "undeployed",
    indexerHttpUrl: "http://127.0.0.1:8088/api/v4/graphql",
    indexerWsUrl: "ws://127.0.0.1:8088/api/v4/graphql/ws",
    nodeWsUrl: "ws://127.0.0.1:9944",
    feeBlocksMargin: 100,
    midns: null,
  },
} as const;

export type NetworkId = keyof typeof NETWORKS;
/** A network with the user's endpoints, if the user set some. */
export type Network = {
  networkId: NetworkId;
  indexerHttpUrl: string;
  indexerWsUrl: string;
  nodeWsUrl: string;
  feeBlocksMargin: number;
  midns: string | null;
};
/** The endpoints that the user can change, in snap state at `settings.endpoints.<networkId>`. */
export type Endpoints = { indexerHttpUrl: string; nodeWsUrl: string };
export const NETWORK_IDS = Object.keys(NETWORKS) as NetworkId[];
export const isNetworkId = (v: unknown): v is NetworkId => typeof v === "string" && Object.hasOwn(NETWORKS, v);

// Default network. Set it with `SNAP_NETWORK=undeployed pnpm build`. The network in snap state has priority.
declare const SNAP_NETWORK: string | undefined;
const BUILD_DEFAULT: NetworkId = typeof SNAP_NETWORK === "string" && isNetworkId(SNAP_NETWORK) ? SNAP_NETWORK : "stagenet";

/** Snap state at a Lodash-style key path (`a.b`). Keys that contain dots, such as origins, are not paths. */
export const getState = async <T>(key: string): Promise<T | undefined> =>
  ((await snap.request({ method: "snap_getState", params: { key } })) ?? undefined) as T | undefined;

export const setState = (key: string, value: unknown) =>
  snap.request({ method: "snap_setState", params: { key, value: value as Json } });

/** The active network. Each entry handler must call `loadNetwork` first: a new executor starts with the build default. */
export let NETWORK: Network = NETWORKS[BUILD_DEFAULT];

/** The network with the user's endpoints. The indexer WebSocket URL follows the indexer URL. */
async function withEndpoints(id: NetworkId): Promise<Network> {
  const custom = await getState<Partial<Endpoints>>(`settings.endpoints.${id}`);
  const base = NETWORKS[id];
  return {
    ...base,
    ...(custom?.indexerHttpUrl ? { indexerHttpUrl: custom.indexerHttpUrl, indexerWsUrl: `${custom.indexerHttpUrl.replace(/^http/, "ws")}/ws` } : {}),
    ...(custom?.nodeWsUrl ? { nodeWsUrl: custom.nodeWsUrl } : {}),
  };
}

export async function loadNetwork(): Promise<Network> {
  const id = await getState("settings.networkId");
  NETWORK = await withEndpoints(isNetworkId(id) ? id : BUILD_DEFAULT);
  return NETWORK;
}

export async function setNetwork(id: string): Promise<Network> {
  if (!isNetworkId(id)) throw new Error(`unknown network "${id}"; expected one of ${NETWORK_IDS.join(", ")}`);
  await setState("settings.networkId", id);
  NETWORK = await withEndpoints(id);
  return NETWORK;
}

/** The endpoints of the active network, and whether the user changed them. */
export function endpoints() {
  const base = NETWORKS[NETWORK.networkId];
  return {
    indexerHttpUrl: NETWORK.indexerHttpUrl,
    nodeWsUrl: NETWORK.nodeWsUrl,
    custom: NETWORK.indexerHttpUrl !== base.indexerHttpUrl || NETWORK.nodeWsUrl !== base.nodeWsUrl,
    defaults: { indexerHttpUrl: base.indexerHttpUrl, nodeWsUrl: base.nodeWsUrl },
  };
}

/** Validate an endpoint URL. Returns it without a trailing slash. */
export function endpointUrl(name: string, value: unknown, protocols: string[]) {
  let url: URL;
  try {
    url = new URL(String(value).trim());
  } catch {
    throw new Error(`${name} is not a URL: "${String(value)}"`);
  }
  if (!protocols.includes(url.protocol)) throw new Error(`${name} must use ${protocols.map((p) => p.replace(":", "")).join(" or ")}`);
  return url.toString().replace(/\/$/, "");
}

/**
 * Validate a change of the active network's endpoints. An empty value restores the default.
 * Returns the endpoints to store, or null for none.
 */
export function validEndpointsPatch(patch: unknown): Partial<Endpoints> | null {
  const src = (patch && typeof patch === "object" ? patch : {}) as Record<string, unknown>;
  const base = NETWORKS[NETWORK.networkId];
  const next: Partial<Endpoints> = {};
  const indexer = src.indexerHttpUrl === undefined ? NETWORK.indexerHttpUrl : String(src.indexerHttpUrl ?? "").trim();
  const node = src.nodeWsUrl === undefined ? NETWORK.nodeWsUrl : String(src.nodeWsUrl ?? "").trim();
  if (indexer && indexer !== base.indexerHttpUrl) next.indexerHttpUrl = endpointUrl("indexerHttpUrl", indexer, ["http:", "https:"]);
  if (node && node !== base.nodeWsUrl) next.nodeWsUrl = endpointUrl("nodeWsUrl", node, ["ws:", "wss:"]);
  return Object.keys(next).length ? next : null;
}

export async function setEndpoints(endpoints: Partial<Endpoints> | null): Promise<Network> {
  await setState(`settings.endpoints.${NETWORK.networkId}`, endpoints);
  return loadNetwork();
}

/** Proving keys and SRS. A copy of Midnight's S3 bucket with the same paths. S3 sends no CORS headers, so the snap cannot use it. */
export const PROVING_PARAMS_URL = "https://assets.midnames.com";

/** Proof server for `provingStrategy: "server"`. */
export const DEFAULT_PROVING_SERVER_URL = "http://localhost:6300";

/** Time for one request. `endowment:rpc.maxRequestTime` is 180 s, the platform maximum. Keep 15 s to save state. */
export const REQUEST_BUDGET_MS = 165_000;
