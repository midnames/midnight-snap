// MidNS, the Midnames name service: forward (name to address) and reverse (address to names) resolution.
//
// src/midns/ns.compact is ns.compact from @midnames/sdk 2.0.2, with `pragma language_version >= 0.22` instead of the
// exact 0.22. The bindings in src/midns/contract/ come from `compact compile +0.34.0 --skip-zk src/midns/ns.compact
// src/midns` (ledger 9, compact-runtime 0.19.0). They also read a contract that a different compiler deployed: the
// ledger layout comes from the source. The snap only reads the contract, so it has no proving keys for it.
import { ContractState } from "@midnight-ntwrk/compact-runtime";
import {
  MidnightBech32m,
  ShieldedAddress,
  ShieldedCoinPublicKey,
  ShieldedEncryptionPublicKey,
  UnshieldedAddress,
} from "@midnightntwrk/wallet-sdk-address-format";
import { hex } from "@scure/base";
import type { Network } from "./config";
import { makeHttp } from "./fastsync/indexerClient.ts";
import { ledger } from "./midns/contract/index.js";

/** `AddressType` in ns.compact, by value. */
const TARGET_KINDS = ["contract", "shielded", "unshielded"] as const;

export type NameRecord = {
  name: string;
  target: { kind: (typeof TARGET_KINDS)[number]; hex: string };
  /** The unshielded address of the owner. The owner is who controls the name, not who receives. */
  owner: string;
  fields: Record<string, string>;
  /** The address for an unshielded transfer, if the target is an unshielded address. */
  unshielded?: string;
  /** The address for a shielded transfer, if the target is a coin public key and the `epk` field has its encryption key. */
  shielded?: string;
};

/** A name, not an address: labels of a-z, 0-9 and "-", joined by dots, with at least one dot. */
export const isName = (s: string) => /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(s);

// A label is left-aligned in 32 bytes and padded with 0xff (`verify_domain_path` in ns.compact).
const toLabel = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  if (bytes.length < 1 || bytes.length > 32) throw new Error(`name label "${s}" must be 1 to 32 characters`);
  const b = new Uint8Array(32).fill(255);
  b.set(bytes);
  return b;
};
const fromLabel = (b: Uint8Array) => new TextDecoder().decode(b.subarray(0, b.indexOf(255) < 0 ? 32 : b.indexOf(255)));

/** Resolution over one snapshot of the contract state (the hex of a serialized `ContractState`). */
export function readMidns(stateHex: string, networkId: string) {
  const L = ledger(ContractState.deserialize(hex.decode(stateHex)).data);

  return {
    tld: L.TLD,

    resolve(input: string): NameRecord {
      const name = input.trim().toLowerCase();
      const labels = name.split(".");
      if (labels.pop() !== L.TLD) throw new Error(`"${input}" is not a .${L.TLD} name`);
      let id = L.ROOT_ZONE_ID;
      for (const label of labels.reverse()) {
        const ref = { domain: toLabel(label), parent_id: id };
        if (!L.name_to_id.member(ref)) throw new Error(`${name} is not registered`);
        id = L.name_to_id.lookup(ref);
      }
      const d = L.id_to_data.lookup(id);
      const kind = TARGET_KINDS[d.target_type]!;
      const fields = L.domain_fields.member(id) ? Object.fromEntries(L.domain_fields.lookup(id)) : {};
      const record: NameRecord = { name, target: { kind, hex: hex.encode(d.target) }, owner: hex.encode(d.owner_address.bytes), fields };
      if (kind === "unshielded") record.unshielded = MidnightBech32m.encode(networkId, new UnshieldedAddress(Buffer.from(d.target))).toString();
      if (kind === "shielded" && /^[0-9a-f]{64}$/.test(fields.epk ?? "")) {
        const address = new ShieldedAddress(new ShieldedCoinPublicKey(Buffer.from(d.target)), new ShieldedEncryptionPublicKey(Buffer.from(fields.epk!, "hex")));
        record.shielded = MidnightBech32m.encode(networkId, address).toString();
      }
      return record;
    },

    /**
     * Names whose target or owner is one of `hexes` (32-byte unshielded addresses or coin public keys).
     * The contract has no index by address, so this reads every name.
     */
    namesFor(hexes: string[]): string[] {
      const wanted = new Set(hexes.map((h) => h.toLowerCase()));
      const refs = new Map<bigint, { domain: Uint8Array; parent_id: bigint }>();
      for (const [ref, id] of L.name_to_id) refs.set(id, ref);
      const fullName = (id: bigint) => {
        const labels: string[] = [];
        for (let ref = refs.get(id); ref && id !== L.ROOT_ZONE_ID; id = ref.parent_id, ref = refs.get(id)) labels.push(fromLabel(ref.domain));
        return [...labels, L.TLD].join(".");
      };
      return [...L.id_to_data]
        .filter(([id, d]) => id !== L.ROOT_ZONE_ID && (wanted.has(hex.encode(d.target)) || wanted.has(hex.encode(d.owner_address.bytes))))
        .map(([id]) => fullName(id))
        .sort();
    },
  };
}

/** The latest state of a contract, as the hex of a serialized `ContractState`, or null if the address has no contract. */
export async function fetchContractState(network: Network, address: string): Promise<string | null> {
  const data = await makeHttp(network.indexerHttpUrl).query<{ contractAction: { state: string } | null }>(
    "query ($address: HexEncoded!) { contractAction(address: $address) { state } }",
    { address },
  );
  return data.contractAction?.state ?? null;
}

/** Read the network's MidNS contract from the indexer. */
export async function loadMidns(network: Network) {
  if (!network.midns) throw new Error(`MidNS is not deployed on ${network.networkId}`);
  const state = await fetchContractState(network, network.midns);
  if (!state) throw new Error(`no MidNS contract at ${network.midns} on ${network.networkId}`);
  return readMidns(state, network.networkId);
}
