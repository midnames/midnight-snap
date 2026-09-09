import type { OnRpcRequestHandler } from "@metamask/snaps-sdk";
import { Text } from "@metamask/snaps-sdk/jsx";
import { Roles } from "@midnightntwrk/wallet-sdk-hd";
import { HDKey } from "@scure/bip32";
import * as ledger from "@midnight-ntwrk/ledger-v8";
import {
  MidnightBech32m, ShieldedAddress, ShieldedCoinPublicKey, ShieldedEncryptionPublicKey,
  UnshieldedAddress,
} from "@midnightntwrk/wallet-sdk-address-format";

const NETWORK_ID = "Undeployed";

type Role = (typeof Roles)[keyof typeof Roles];

// Same derivation as @midnightntwrk/wallet-sdk-hd: BIP32 secp256k1 over the BIP39 seed,
// path m/44'/2400'/account'/role/index. MetaMask hands us the m/44'/2400' node; we derive the rest.
async function deriveRole(role: Role, account = 0, index = 0) {
  const node = await snap.request({
    method: "snap_getBip32Entropy",
    params: { path: ["m", "44'", "2400'"], curve: "secp256k1" },
  });
  const key = new HDKey({
    privateKey: Buffer.from(node.privateKey!.slice(2), "hex"),
    chainCode: Buffer.from(node.chainCode.slice(2), "hex"),
  }).derive(`m/${account}'/${role}/${index}`);
  return key.privateKey!;
}

async function deriveNightKey() {
  return Buffer.from(await deriveRole(Roles.NightExternal)).toString("hex");
}

async function signData(hex: string) {
  const sk = await deriveNightKey();
  const ok = await snap.request({
    method: "snap_dialog",
    params: { type: "confirmation", content: Text({ children: `Sign ${hex.length / 2} bytes with your Midnight unshielded key?` }) },
  });
  if (!ok) throw new Error("user rejected");
  const signature = ledger.signData(sk, Buffer.from(hex, "hex"));
  return { signature, verifyingKey: ledger.signatureVerifyingKey(sk) };
}

async function getAddresses() {

  const zswap = ledger.ZswapSecretKeys.fromSeed(await deriveRole(Roles.Zswap));
  const shielded = new ShieldedAddress(
    new ShieldedCoinPublicKey(Buffer.from(zswap.coinPublicKey, "hex")),
    new ShieldedEncryptionPublicKey(Buffer.from(zswap.encryptionPublicKey, "hex")),
  );
  const nightKey = await deriveRole(Roles.NightExternal);
  const unshieldedPk = ledger.signatureVerifyingKey(Buffer.from(nightKey).toString("hex"));
  const unshielded = new UnshieldedAddress(Buffer.from(unshieldedPk, "hex"));
  const dust = ledger.DustSecretKey.fromSeed(await deriveRole(Roles.Dust));

  return {
    shielded: MidnightBech32m.encode(NETWORK_ID, shielded).toString(),
    unshielded: MidnightBech32m.encode(NETWORK_ID, unshielded).toString(),
    dustPublicKey: dust.publicKey.toString(16),
  };
}

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case "ping": return { ok: true, ts: Date.now() };
    case "midnight_getAccounts": return getAddresses();
    case "midnight_signData": return signData((request.params as { hex: string }).hex);
    default: throw new Error(`Method not found: ${request.method}`);
  }
};
