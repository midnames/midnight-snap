// Adds the Midnight Snap to `window.midnight` as a dapp-connector-api 4.0.1 InitialAPI.
// A snap cannot add code to a page, so the page loads this package. Each API call is one
// `wallet_invokeSnap` of the snap's `midnight_connector` method, with bigint-JSON arguments and results.

import type {
  APIError,
  ConnectedAPI,
  ErrorCode,
  InitialAPI,
  KeyMaterialProvider,
  ProvingProvider,
} from '@midnight-ntwrk/dapp-connector-api';

/** Used when `options.snapId` and `globalThis.MIDNIGHT_SNAP_ID` are not set. */
export const DEFAULT_SNAP_ID = 'npm:@midnames/midnight-snap';

export interface RegisterOptions {
  /** For example `npm:@midnames/midnight-snap` or `local:http://localhost:8093`. */
  snapId?: string;
  /** Minimum snap version for `wallet_requestSnaps`. */
  version?: string;
  rdns?: string;
  name?: string;
  icon?: string;
}

type Eip1193 = {
  request(args: { method: string; params?: unknown }): Promise<unknown>;
  isMetaMask?: boolean;
  providers?: Eip1193[];
};

declare global {
  interface Window {
    ethereum?: Eip1193;
    MIDNIGHT_SNAP_ID?: string;
  }
}

const RDNS = 'com.midnames.midnight-snap';
const NAME = 'Midnight Snap';
const API_VERSION = '4.0.1';
const ICON =
  'data:image/svg+xml;base64,' +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#111"/><circle cx="16" cy="16" r="9" fill="none" stroke="#fff" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="#fff"/></svg>',
  );

// ---- errors ----

/** The specification's APIError is an Error with fields, not a class. */
function apiError(code: ErrorCode, reason: string): APIError {
  const error = new Error(reason) as APIError;
  error.type = 'DAppConnectorAPIError';
  error.code = code;
  error.reason = reason;
  return error;
}

/** MetaMask uses EIP-1193 code 4001 when the user refuses a request. */
function fromProviderError(err: unknown): APIError {
  if ((err as APIError)?.type === 'DAppConnectorAPIError') return err as APIError;
  const e = err as { code?: number | string; message?: string };
  if (e?.code === 4001) return apiError('Rejected', e.message ?? 'User rejected the request');
  return apiError('InternalError', e?.message ?? String(err));
}

// ---- bigint-JSON (a copy of the snap's src/bigint-json.ts) ----

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function encode(value: unknown): string {
  return JSON.stringify(value, (_k, v: unknown) => {
    if (v === undefined) return { __t: 'undefined' };
    if (typeof v === 'bigint') return { __t: 'bigint', v: v.toString() };
    if (v instanceof Uint8Array) return { __t: 'bytes', v: bytesToBase64(v) };
    return v;
  });
}

function decode<T = unknown>(payload: string): T {
  const parsed = JSON.parse(payload, (_k, v: unknown) => {
    const tagged = v as { __t?: string; v?: string } | null;
    if (tagged && typeof tagged === 'object' && tagged.__t === 'bigint') return BigInt(tagged.v!);
    if (tagged && typeof tagged === 'object' && tagged.__t === 'bytes') return base64ToBytes(tagged.v!);
    return v;
  });
  // A reviver that returns `undefined` deletes the key, so restore `undefined` in a second pass.
  const restore = (value: unknown): unknown => {
    if (value && typeof value === 'object' && (value as { __t?: string }).__t === 'undefined') return undefined;
    if (value instanceof Uint8Array) return value;
    if (Array.isArray(value)) return value.map(restore);
    if (value && typeof value === 'object') {
      for (const [k, child] of Object.entries(value)) (value as Record<string, unknown>)[k] = restore(child);
    }
    return value;
  };
  return restore(parsed) as T;
}

// ---- provider ----

const METAMASK_RDNS = /^io\.metamask(\.|$)/;

/** Find MetaMask with EIP-6963. When other wallets are installed, `window.ethereum` is frequently not MetaMask. */
function discover(timeoutMs: number): Promise<Eip1193 | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    const onAnnounce = (event: Event) => {
      const detail = (event as CustomEvent<{ info?: { rdns?: string }; provider?: Eip1193 }>).detail;
      if (detail?.provider && METAMASK_RDNS.test(detail.info?.rdns ?? '')) finish(detail.provider);
    };
    const finish = (provider: Eip1193 | null) => {
      window.removeEventListener('eip6963:announceProvider', onAnnounce);
      clearTimeout(timer);
      resolve(provider);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    window.addEventListener('eip6963:announceProvider', onAnnounce);
    window.dispatchEvent(new Event('eip6963:requestProvider'));
  });
}

let cached: Eip1193 | null = null;

/** MetaMask's EIP-1193 provider. The wallet site uses it for the snap's wallet methods. */
export async function provider(): Promise<Eip1193> {
  if (cached) return cached;
  const announced = await discover(300);
  const legacy = typeof window === 'undefined' ? undefined : window.ethereum;
  const found = announced ?? legacy?.providers?.find((p) => p.isMetaMask) ?? (legacy?.isMetaMask ? legacy : null);
  if (!found) throw apiError('Disconnected', 'MetaMask not found. Install MetaMask Flask to use the Midnight Snap.');
  cached = found;
  return found;
}

// ---- api ----

/** Methods that go to the snap without change. `getProvingProvider` takes callbacks, so it is below. */
const METHODS = [
  'getShieldedBalances',
  'getUnshieldedBalances',
  'getDustBalance',
  'getShieldedAddresses',
  'getUnshieldedAddress',
  'getDustAddress',
  'getTxHistory',
  'balanceUnsealedTransaction',
  'balanceSealedTransaction',
  'makeTransfer',
  'makeIntent',
  'signData',
  'submitTransaction',
  'getConfiguration',
  'getConnectionStatus',
  'hintUsage',
] as const;

type Envelope = { ok: true; result: string } | { ok: false; error: { code: ErrorCode; reason: string } };

function isEnvelope(value: unknown): value is Envelope {
  return !!value && typeof value === 'object' && typeof (value as Envelope).ok === 'boolean';
}

function buildConnected(call: (method: string, args: unknown[]) => Promise<unknown>): ConnectedAPI {
  const api: Record<string, (...args: unknown[]) => Promise<unknown>> = {};
  for (const method of METHODS) api[method] = (...args) => call(method, args);

  // The dApp's KeyMaterialProvider stays in the page. Each proving call sends the key material to the snap.
  api.getProvingProvider = async (candidate: unknown): Promise<ProvingProvider> => {
    const keys = candidate as Partial<KeyMaterialProvider> | null;
    if (!keys || typeof keys.getZKIR !== 'function' || typeof keys.getProverKey !== 'function' || typeof keys.getVerifierKey !== 'function') {
      throw apiError('InvalidRequest', 'getProvingProvider requires a KeyMaterialProvider');
    }
    await call('getProvingProvider', []);

    const materialFor = async (keyLocation: string) => {
      const [zkir, proverKey, verifierKey] = await Promise.all([
        keys.getZKIR!(keyLocation),
        keys.getProverKey!(keyLocation),
        keys.getVerifierKey!(keyLocation),
      ]);
      return { zkir, proverKey, verifierKey };
    };

    return Object.freeze({
      async check(serializedPreimage: Uint8Array, keyLocation: string) {
        const material = await materialFor(keyLocation);
        return (await call('provingProviderCheck', [serializedPreimage, keyLocation, material])) as (bigint | undefined)[];
      },
      async prove(serializedPreimage: Uint8Array, keyLocation: string, overwriteBindingInput?: bigint) {
        const material = await materialFor(keyLocation);
        return (await call('provingProviderProve', [serializedPreimage, keyLocation, material, overwriteBindingInput])) as Uint8Array;
      },
    });
  };

  return Object.freeze(api) as unknown as ConnectedAPI;
}

const resolveSnapId = (options: RegisterOptions) =>
  options.snapId ?? (typeof window === 'undefined' ? undefined : window.MIDNIGHT_SNAP_ID) ?? DEFAULT_SNAP_ID;

/** The InitialAPI, without a change to `window.midnight`. */
export function createMidnightSnapApi(options: RegisterOptions = {}): InitialAPI {
  const snapId = resolveSnapId(options);

  const call = async (method: string, args: unknown[]): Promise<unknown> => {
    let reply: unknown;
    try {
      reply = await (await provider()).request({
        method: 'wallet_invokeSnap',
        params: { snapId, request: { method: 'midnight_connector', params: { method, args: encode(args) } } },
      });
    } catch (err) {
      throw fromProviderError(err);
    }
    if (!isEnvelope(reply)) throw apiError('InternalError', `Unexpected reply from ${snapId}; is it an older Midnight Snap?`);
    if (!reply.ok) throw apiError(reply.error.code, reply.error.reason);
    return decode(reply.result);
  };

  return Object.freeze({
    rdns: options.rdns ?? RDNS,
    name: options.name ?? NAME,
    icon: options.icon ?? ICON,
    apiVersion: API_VERSION,
    async connect(networkId: string): Promise<ConnectedAPI> {
      // Each `wallet_requestSnaps` shows a MetaMask window, also for an installed snap. Request only when necessary.
      try {
        const p = await provider();
        const installed = (await p.request({ method: 'wallet_getSnaps' })) as Record<string, unknown> | null;
        // With `version`, always request. Compare versions if this shows too many windows.
        if (!installed?.[snapId] || options.version) {
          await p.request({ method: 'wallet_requestSnaps', params: { [snapId]: options.version ? { version: options.version } : {} } });
        }
      } catch (err) {
        throw fromProviderError(err);
      }
      await call('connect', [networkId]);
      return buildConnected(call);
    },
  });
}

/** `crypto.randomUUID` exists only in secure contexts. A dApp on plain http also needs a key. */
function uuidv4(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6]! & 0x0f) | 0x40; // version 4
  b[8] = (b[8]! & 0x3f) | 0x80; // RFC 4122 variant
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** APIs registered by this package, by snap id. Shared by all bundles of the package in the page. */
const REGISTRY = Symbol.for('@midnames/midnight-snap-connector');

/**
 * Add the snap to `window.midnight`, as the specification requires: create `window.midnight` as
 * non-writable and non-configurable if it does not exist, and add the API under a new UUIDv4 key.
 *
 * Synchronous, because dApps read `window.midnight` when they start. MetaMask is found at the first
 * call. A second registration of the same snap id returns the first API.
 */
export function registerMidnightSnap(options: RegisterOptions = {}): InitialAPI {
  if (typeof window === 'undefined') throw new Error('registerMidnightSnap requires a browser window');
  const snapId = resolveSnapId(options);
  const registry: Record<string, InitialAPI> = ((window as unknown as Record<symbol, Record<string, InitialAPI>>)[REGISTRY] ??= Object.create(null));
  if (registry[snapId]) return registry[snapId]!;

  if (!window.midnight) {
    Object.defineProperty(window, 'midnight', { value: Object.create(null), writable: false, configurable: false });
  }
  const api = createMidnightSnapApi({ ...options, snapId });
  Object.defineProperty(window.midnight, uuidv4(), { value: api, writable: false, configurable: false, enumerable: true });
  registry[snapId] = api;
  return api;
}
