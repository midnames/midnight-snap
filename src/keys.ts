import { Roles } from "@midnightntwrk/wallet-sdk-hd";
import { HDKey } from "@scure/bip32";
import * as ledger from "@midnightntwrk/ledger-v9";
import { createKeystore } from "@midnightntwrk/wallet-sdk-unshielded-wallet";
import { NETWORK } from "./config";

type Role = (typeof Roles)[keyof typeof Roles];

// Same derivation as @midnightntwrk/wallet-sdk-hd: BIP32 secp256k1 over the BIP39 seed, path
// m/44'/2400'/account'/role/index. MetaMask gives the m/44'/2400' node. This file derives the rest.
async function accountNode() {
  const node = await snap.request({
    method: "snap_getBip32Entropy",
    params: { path: ["m", "44'", "2400'"], curve: "secp256k1" },
  });
  return new HDKey({
    privateKey: Buffer.from(node.privateKey!.slice(2), "hex"),
    chainCode: Buffer.from(node.chainCode.slice(2), "hex"),
  });
}

/** Keys of account 0, index 0. The unshielded keystore encodes addresses for `networkId`. */
export async function deriveKeys(networkId: string = NETWORK.networkId) {
  const root = await accountNode();
  const role = (r: Role) => root.derive(`m/0'/${r}/0`).privateKey!;
  const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(role(Roles.Zswap));
  const dustSecretKey = ledger.DustSecretKey.fromSeed(role(Roles.Dust));
  const unshieldedKeystore = createKeystore({ kind: "schnorr", secret: role(Roles.NightExternal) }, networkId);
  root.wipePrivateData();
  return { shieldedSecretKeys, dustSecretKey, unshieldedKeystore };
}
export type Keys = Awaited<ReturnType<typeof deriveKeys>>;
