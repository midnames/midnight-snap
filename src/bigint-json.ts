// Wire format between the page and the snap: bigint, bytes and undefined survive JSON.
// ../connector/src/index.ts has a copy.
import { base64 } from "@scure/base";

export function encodeBigintJson(value: unknown): string {
  return JSON.stringify(value, (_k, v: unknown) => {
    if (v === undefined) return { __t: "undefined" };
    if (typeof v === "bigint") return { __t: "bigint", v: v.toString() };
    if (v instanceof Uint8Array) return { __t: "bytes", v: base64.encode(v) };
    return v;
  });
}

export function decodeBigintJson<T = unknown>(payload: string): T {
  const fix = (v: any): any => {
    if (!v || typeof v !== "object") return v;
    if (v.__t === "undefined") return undefined;
    if (v.__t === "bigint") return BigInt(v.v);
    if (v.__t === "bytes") return base64.decode(v.v);
    if (Array.isArray(v)) return v.map(fix);
    for (const k of Object.keys(v)) v[k] = fix(v[k]);
    return v;
  };
  return fix(JSON.parse(payload)) as T;
}
