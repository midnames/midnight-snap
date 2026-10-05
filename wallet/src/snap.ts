// The snap's wallet RPC methods (README, "Wallet RPC methods"), and amount formatting.
import { provider } from '../../connector/src/index.ts';

export const SNAP_ID =
  new URLSearchParams(location.search).get('snap') ??
  import.meta.env.VITE_SNAP_ID ??
  (import.meta.env.DEV ? 'local:http://localhost:8093' : 'npm:@midnames/midnight-snap');

export const invoke = async <T,>(method: string, params?: unknown): Promise<T> =>
  (await provider()).request({ method: 'wallet_invokeSnap', params: { snapId: SNAP_ID, request: { method, params } } }) as Promise<T>;

export type Kind = 'unshielded' | 'shielded';
export type Summary = {
  at: number;
  synced: boolean;
  unshielded: string;
  shielded: string;
  dust: string;
  tokens?: Record<Kind, Record<string, string>>;
  dustDetail?: {
    generatedNow: string;
    maxCap: string;
    coins: Array<{ generatedNow: string; maxCap: string; maxCapReachedAt: string; decaying: boolean }>;
    night: Array<{ value: string; registered: boolean }>;
  };
  names?: Array<{ name: string; did?: string }>;
};
export type Accounts = { unshielded: string; shielded: string; dustPublicKey: string };
export type SyncOptions = { shieldedFast: boolean; provingStrategy: 'browser' | 'server'; provingServerUrl: string };
export type Endpoints = { indexerHttpUrl: string; nodeWsUrl: string; custom: boolean; defaults: { indexerHttpUrl: string; nodeWsUrl: string } };
export type Network = { networkId: string; available: string[]; endpoints: Endpoints };
export type HistoryEntry = {
  hash: string;
  status: 'pending' | 'success' | 'partial' | 'failure' | 'rejected';
  at: string | null;
  fee: string | null;
  unshielded: Record<string, string>;
  shielded: Record<string, string>;
};
type Progress = { applied: string; highest: string; connected: boolean };
export type SyncProgress = { startedAt: number; at: number; synced: boolean; shielded: Progress; unshielded: Progress; dust: Progress } | null;
export type TransferOutput = { type: Kind; to: string; amount: string; token: string };

/** Tokens have no names on chain. The native token, NIGHT, has the type 00…00 in both kinds. */
export const NATIVE = '0'.repeat(64);
export const NIGHT_DECIMALS = 6;
/** 10^15 Specks in one DUST. */
export const DUST_DECIMALS = 15;
/** Only NIGHT has known decimals. Other tokens show units. */
export const decimalsOf = (token: string) => (token === NATIVE ? NIGHT_DECIMALS : 0);
/** Names that the user gave to tokens in this browser. Set by the App on each render. */
let localNames: Record<string, string> = {};
export const setTokenNames = (names: Record<string, string>) => (localNames = names);
export const shortId = (token: string) => `${token.slice(0, 8)}…${token.slice(-6)}`;
export const tokenName = (token: string) => (token === NATIVE ? 'NIGHT' : (localNames[token] ?? shortId(token)));

/** Atomic units to a decimal string, without floats. `digits` cuts the fraction (rounds down). */
export function formatUnits(raw: string | bigint, decimals: number, digits = decimals): string {
  const v = BigInt(raw);
  const sign = v < 0n ? '-' : '';
  const abs = v < 0n ? -v : v;
  if (decimals === 0) return sign + abs.toLocaleString('en-US');
  const base = 10n ** BigInt(decimals);
  const frac = (abs % base).toString().padStart(decimals, '0').slice(0, digits).replace(/0+$/, '');
  return `${sign}${(abs / base).toLocaleString('en-US')}${frac ? `.${frac}` : ''}`;
}

/** A decimal string to atomic units. Throws for more decimals than the token has. */
export function parseUnits(input: string, decimals: number): bigint {
  const m = /^(\d*)(?:\.(\d*))?$/.exec(input.trim().replace(/,/g, ''));
  if (!m || (!m[1] && !m[2])) throw new Error(decimals ? 'Enter a number like 1.5' : 'Enter a whole number');
  const frac = m[2] ?? '';
  if (frac.length > decimals) throw new Error(decimals ? `At most ${decimals} decimals` : 'Enter a whole number');
  return BigInt(m[1] || '0') * 10n ** BigInt(decimals) + BigInt(frac.padEnd(decimals, '0') || '0');
}

export const isName = (s: string) => /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(s.trim().toLowerCase());
export const message = (e: unknown) => (e as { message?: string })?.message ?? String(e);
