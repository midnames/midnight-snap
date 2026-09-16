// did:midnight resolution with @midnight-ntwrk/midnight-did 0.5.0 (midnightntwrk/midnight-did).
//
// The package decodes nothing itself: its resolver asks a `ledgerReader` for the contract ledger. The snap reads the
// state from the indexer and decodes it with the ledger-9 bindings of did.compact in src/did/contract/, which
// pnpm-workspace.yaml puts in place of @midnight-ntwrk/midnight-did-contract. The DID method has no "stagenet"
// network, so patches/ adds it to @midnight-ntwrk/midnight-did-domain.
import { ContractState } from "@midnight-ntwrk/compact-runtime";
import { MidnightDIDResolver, MidnightNetwork } from "@midnight-ntwrk/midnight-did";
import { DIDContract } from "./did/contract/index.js";
import { hex } from "@scure/base";
import type { Network } from "./config";
import { fetchContractState } from "./midns.ts";

const DID_NETWORKS: Record<string, MidnightNetwork> = {
  stagenet: MidnightNetwork.Stagenet,
  undeployed: MidnightNetwork.Undeployed,
};

/**
 * Resolve `did` to a W3C DID resolution result: the document, its metadata (for example `deactivated`), and
 * `didResolutionMetadata.error` if it fails (`invalidDid`, `notFound`). `readState` gives the contract state hex.
 */
export async function resolveDidWith(networkId: string, did: string, readState: (address: string) => Promise<string | null>) {
  const resolver = new MidnightDIDResolver({
    expectedNetwork: DID_NETWORKS[networkId],
    ledgerReader: async (address) => {
      const state = await readState(address);
      return state === null ? null : DIDContract.ledger(ContractState.deserialize(hex.decode(state)).data);
    },
  });
  // Plain JSON for the RPC reply.
  return JSON.parse(JSON.stringify(await resolver.resolveDIDResolutionResult(did))) as Awaited<ReturnType<MidnightDIDResolver["resolveDIDResolutionResult"]>>;
}

export const resolveDid = (network: Network, did: string) =>
  resolveDidWith(network.networkId, did, (address) => fetchContractState(network, address));
