// Amounts in NIGHT (6 decimals), DUST (15 decimals), or units of other tokens.
import * as ledger from "@midnightntwrk/ledger-v9";

const NIGHT_DECIMALS = 6;
const DUST_DECIMALS = 15;

export function formatUnits(raw: bigint | string, decimals: number): string {
  const v = BigInt(raw);
  const sign = v < 0n ? "-" : "";
  const abs = v < 0n ? -v : v;
  if (decimals === 0) return sign + abs.toString();
  const base = 10n ** BigInt(decimals);
  const frac = (abs % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${sign}${abs / base}${frac ? `.${frac}` : ""}`;
}

export function parseUnits(input: string, decimals: number): bigint {
  const m = /^(\d*)(?:\.(\d*))?$/.exec(input.trim());
  if (!m || (!m[1] && !m[2])) throw new Error(`"${input}" is not an amount`);
  const frac = m[2] ?? "";
  if (frac.length > decimals) throw new Error(decimals ? `at most ${decimals} decimals` : "enter a whole number");
  return BigInt(m[1] || "0") * 10n ** BigInt(decimals) + BigInt(frac.padEnd(decimals, "0") || "0");
}

export const isNight = (token: string) => token.toLowerCase() === ledger.nativeToken().raw;

export const tokenAmount = (raw: bigint | string, token: string) =>
  isNight(token) ? `${formatUnits(raw, NIGHT_DECIMALS)} NIGHT` : `${formatUnits(raw, 0)} units of ${token}`;

export const night = (raw: bigint | string) => `${formatUnits(raw, NIGHT_DECIMALS)} NIGHT`;
export const dust = (raw: bigint | string) => `${formatUnits(raw, DUST_DECIMALS)} DUST`;

export const decimalsOf = (token: string) => (isNight(token) ? NIGHT_DECIMALS : 0);
