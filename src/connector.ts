// dapp-connector-api 4.0.1 over one snap RPC method:
//   wallet_invokeSnap { method: "midnight_connector", params: { method, args } }
// `args` and `result` are bigint-json strings (src/bigint-json.ts). The reply is an {ok, result | error}
// envelope, because MetaMask removes the `code` from a thrown error. ../connector/ is the page side.
import * as ledger from "@midnightntwrk/ledger-v9";
import { DustAddress } from "@midnightntwrk/wallet-sdk-address-format";
import { base64, hex, utf8 } from "@scure/base";
import { getState, NETWORK, REQUEST_BUDGET_MS, setState } from "./config";
import { deriveKeys } from "./keys";
import { addressesFromKeys, confirm, describe, finalize, getSyncOptions, parseRecipient, secretKeys, trace, ttl, withWallet, type Session } from "./wallet";
import { decodeBigintJson, encodeBigintJson } from "./bigint-json";
import { dust, tokenAmount } from "./units";
import { checkWithKeyMaterial, proveWithKeyMaterial } from "./proving/browserProving";

type ErrorCode = "InternalError" | "Rejected" | "InvalidRequest" | "PermissionRejected" | "Disconnected";

class ConnectorError extends Error {
  constructor(readonly code: ErrorCode, message: string) {
    super(message);
  }
}

const rejected = () => new ConnectorError("Rejected", "user rejected");

/**
 * The bytes that `signData` signs, as the connector specification requires:
 * utf8(`midnight_signed_message:<byte length>:`) followed by the data. The same key signs
 * transactions, so without the prefix a site could get a transaction signed as "data".
 */
export function signedMessageBytes(data: Uint8Array): Uint8Array {
  return new Uint8Array(Buffer.concat([Buffer.from(`midnight_signed_message:${data.length}:`), data]));
}

const DECODERS: Record<string, (s: string) => Uint8Array> = {
  hex: (s) => hex.decode(s.replace(/^0x/, "")),
  // Accept whitespace and missing padding. Other invalid input fails.
  base64: (s) => {
    const b = s.replace(/\s/g, "");
    return base64.decode(b.padEnd(Math.ceil(b.length / 4) * 4, "="));
  },
  text: (s) => utf8.decode(s),
};

/** Strict decode. The dialog must show the bytes that are signed. */
export function decodeSignData(data: unknown, encoding: string): Uint8Array {
  const decode = Object.hasOwn(DECODERS, encoding) ? DECODERS[encoding] : undefined;
  if (!decode) throw new ConnectorError("InvalidRequest", `unsupported encoding "${encoding}"`);
  try {
    return decode(String(data));
  } catch {
    throw new ConnectorError("InvalidRequest", `data is not valid ${encoding}`);
  }
}

const fromHex = (h: string) => decodeSignData(h, "hex");

// ---- per-origin grants: snap state `origins`, origin -> network id ----
// Origins contain dots, so `origins` is read and written as one object, not with key paths.

const grants = async () => (await getState<Record<string, string>>("origins")) ?? {};
const isGranted = async (origin: string) => (await grants())[origin] === NETWORK.networkId;

/** Origins connected on the active network. A grant is for one network only. */
export async function listGrants(): Promise<string[]> {
  return Object.entries(await grants())
    .filter(([, networkId]) => networkId === NETWORK.networkId)
    .map(([origin]) => origin)
    .sort();
}

export async function revokeGrant(origin: string): Promise<boolean> {
  const { [origin]: had, ...rest } = await grants();
  if (had === undefined) return false;
  await setState("origins", rest);
  return true;
}

// ---- transactions ----

type Output = { kind: "shielded" | "unshielded"; type: string; value: bigint; recipient: string };

function toTransfers(outputs: Output[]) {
  const group = (kind: Output["kind"]) =>
    outputs.filter((o) => o.kind === kind).map((o) => ({ type: o.type, receiverAddress: parseRecipient(kind, o.recipient), amount: BigInt(o.value) }));
  try {
    const t = (["shielded", "unshielded"] as const).map((type) => ({ type, outputs: group(type) })).filter((g) => g.outputs.length > 0);
    if (!t.length) throw new Error("no outputs");
    return t as any[];
  } catch (e) {
    throw new ConnectorError("InvalidRequest", String((e as Error).message ?? e));
  }
}

const describeOutput = (o: Output) => `${o.kind} ${tokenAmount(o.value, o.type)} to ${o.recipient}`;

/** Spec default: the wallet pays fees unless the dApp sets `payFees: false`. */
const payFees = (options: { payFees?: boolean } | undefined) => options?.payFees !== false;

/** Balance a dApp transaction. With `payFees: false` the wallet adds no DUST spend. */
async function balance(origin: string, sealed: boolean, txHex: string, options: { payFees?: boolean } | undefined) {
  const tx = ledger.Transaction.deserialize("signature", "proof", sealed ? "binding" : "pre-binding", fromHex(txHex));
  return withWallet(REQUEST_BUDGET_MS - 90_000, async (s) => {
    const balanceOptions = { ttl: ttl(), tokenKindsToBalance: payFees(options) ? ("all" as const) : ["shielded" as const, "unshielded" as const] };
    // The spec says sealed/unsealed. The facade still says finalized/unbound.
    const recipe = sealed
      ? await s.facade.balanceFinalizedTransaction(tx as any, secretKeys(s.keys), balanceOptions)
      : await s.facade.balanceUnboundTransaction(tx as any, secretKeys(s.keys), balanceOptions);
    const balancing = (recipe as any).balancingTransaction;
    const fee = payFees(options) ? dust(balancing ? await s.facade.calculateTransactionFee(balancing) : 0n) : "paid by the dApp, not this wallet";
    if (!(await confirm(`Balance transaction for ${origin}`, [["Kind", sealed ? "sealed" : "unsealed"], ["Fee", fee]]))) {
      await s.facade.revert(recipe).catch(() => undefined);
      throw rejected();
    }
    return { tx: await track(s, await finalize(s, recipe)) };
  });
}

/** Track a transaction the dApp gets, so its booked coins are released when its TTL passes. */
async function track(s: Session, tx: { serialize(): Uint8Array }) {
  await s.facade.pendingTransactionsService.addPendingTransaction(tx as never);
  return hex.encode(tx.serialize());
}

const read = <T>(fn: (s: Session) => T | Promise<T>) => withWallet(REQUEST_BUDGET_MS - 20_000, async (s) => fn(s));

const handlers: Record<string, (origin: string, args: any[]) => Promise<unknown>> = {
  async connect(origin, [networkId]) {
    if (networkId !== NETWORK.networkId) throw new Error(`the wallet is on "${NETWORK.networkId}", dApp asked for "${networkId}"`);
    if (await isGranted(origin)) return null;
    if (!(await confirm("Connect to Midnight dApp", [["Site", origin], ["Network", NETWORK.networkId], ["Access", "addresses, balances, history; every transaction still asks"]]))) {
      throw rejected();
    }
    await setState("origins", { ...(await grants()), [origin]: NETWORK.networkId });
    return null;
  },
  async getConnectionStatus(origin) {
    return (await isGranted(origin)) ? { status: "connected", networkId: NETWORK.networkId } : { status: "disconnected" };
  },
  async getConfiguration() {
    // `proverServerUri` is optional and deprecated. Send it only when the user proves with a server.
    const o = await getSyncOptions();
    return {
      indexerUri: NETWORK.indexerHttpUrl,
      indexerWsUri: NETWORK.indexerWsUrl,
      proverServerUri: o.provingStrategy === "server" ? o.provingServerUrl : undefined,
      substrateNodeUri: NETWORK.nodeWsUrl,
      networkId: NETWORK.networkId,
    };
  },
  async hintUsage() {
    return null;
  },

  async getShieldedAddresses() {
    const keys = await deriveKeys();
    const z = keys.shieldedSecretKeys;
    return { shieldedAddress: addressesFromKeys(keys).shielded, shieldedCoinPublicKey: z.coinPublicKey, shieldedEncryptionPublicKey: z.encryptionPublicKey };
  },
  async getUnshieldedAddress() {
    return { unshieldedAddress: addressesFromKeys(await deriveKeys()).unshielded };
  },
  async getDustAddress() {
    const keys = await deriveKeys();
    return { dustAddress: DustAddress.encodePublicKey(NETWORK.networkId, keys.dustSecretKey.publicKey) };
  },

  getShieldedBalances: () => read(({ state }) => state.shielded.balances),
  getUnshieldedBalances: () => read(({ state }) => state.unshielded.balances),
  getDustBalance: () =>
    read(({ state }) => {
      const coins = state.dust.availableCoins;
      // A coin with a `dtime` lost its backing NIGHT. It still has a balance, but it does not add to the cap.
      const cap = coins.filter((c) => !c.dtime).reduce((a, c) => a + c.maxCap, 0n);
      return { cap, balance: coins.reduce((a, c) => a + c.generatedNow, 0n) };
    }),
  async getTxHistory(_origin, [pageNumber, pageSize]) {
    if (!(pageSize > 0)) return [];
    return read(async ({ facade }) => {
      const entries = (await facade.getAllFromTxHistory()) as any[];
      const sorted = [...entries].sort((a, b) => (b.timestamp?.getTime?.() ?? 0) - (a.timestamp?.getTime?.() ?? 0));
      const start = Math.max(0, pageNumber) * pageSize;
      return sorted.slice(start, start + pageSize).map((e) => ({
        txHash: e.hash,
        txStatus: e.lifecycle?.status === "PENDING" ? { status: "pending" } : { status: "finalized", executionStatus: { 0: e.status === "FAILURE" ? "Failure" : "Success" } },
      }));
    });
  },

  async makeTransfer(origin, [outputs, options]) {
    const transfers = toTransfers(outputs);
    return withWallet(REQUEST_BUDGET_MS - 90_000, async (s) => {
      const recipe = await s.facade.transferTransaction(transfers, secretKeys(s.keys), { ttl: ttl(), payFees: payFees(options) });
      const fee = await s.facade.calculateTransactionFee(recipe.transaction);
      const rows = (outputs as Output[]).map((o, i) => [`Output ${i + 1}`, describeOutput(o)] as [string, string]);
      if (!(await confirm(`Transfer requested by ${origin}`, [...rows, ["Fee", `${fee} Specks (DUST)`]]))) {
        await s.facade.revert(recipe).catch(() => undefined);
        throw rejected();
      }
      await trace(`connector makeTransfer for ${origin}`);
      return { tx: await track(s, await finalize(s, recipe)) };
    });
  },
  async makeIntent(origin, [inputs, outputs, options]) {
    const transfers = toTransfers(outputs);
    const wanted: Record<string, Record<string, bigint>> = {};
    for (const i of inputs as Array<{ kind: string; type: string; value: bigint }>) {
      (wanted[i.kind] ??= {})[i.type] = (wanted[i.kind]![i.type] ?? 0n) + BigInt(i.value);
    }
    return withWallet(REQUEST_BUDGET_MS - 90_000, async (s) => {
      const { facade, keys } = s;
      const recipe = await facade.initSwap(wanted as any, transfers, secretKeys(keys), { ttl: ttl(), payFees: !!options?.payFees });
      const ok = await confirm(`Swap intent requested by ${origin}`, [
        ...(inputs as any[]).map((i, n) => [`Give ${n + 1}`, `${i.kind} ${tokenAmount(BigInt(i.value), String(i.type))}`] as [string, string]),
        ...(outputs as Output[]).map((o, n) => [`Get ${n + 1}`, describeOutput(o)] as [string, string]),
        ["Pays fees", String(!!options?.payFees)],
      ]);
      if (!ok) {
        await facade.revert(recipe).catch(() => undefined);
        throw rejected();
      }
      // Not validated: the intent is unbalanced on purpose.
      try {
        const signed = await facade.signRecipe(recipe, keys.unshieldedKeystore.signDataAsync);
        return { tx: await track(s, await facade.finalizeRecipe(signed)) };
      } catch (e) {
        await facade.revert(recipe).catch(() => undefined);
        throw e;
      }
    });
  },
  balanceUnsealedTransaction: (origin, [txHex, options]) => balance(origin, false, txHex, options),
  balanceSealedTransaction: (origin, [txHex, options]) => balance(origin, true, txHex, options),
  async submitTransaction(origin, [txHex]) {
    const tx = ledger.Transaction.deserialize("signature", "proof", "binding", fromHex(txHex));
    return withWallet(REQUEST_BUDGET_MS - 60_000, async ({ facade }) => {
      try {
        await trace(`connector submit for ${origin}: ${await facade.submitTransaction(tx as any)}`);
        return null;
      } catch (e: any) {
        const detail = describe(e);
        await trace(`connector submit FAILED for ${origin}: ${detail}`);
        // Release the coins that this transaction booked, so that the wallet can spend them again.
        await facade.revertTransaction(tx as any).catch(() => undefined);
        throw new Error(`submitTransaction: ${detail}`);
      }
    });
  },
  async signData(origin, [data, options]) {
    const encoding = options?.encoding ?? "hex";
    if (options?.keyType && options.keyType !== "unshielded") throw new ConnectorError("InvalidRequest", "only keyType 'unshielded' is supported");
    const bytes = decodeSignData(data, encoding);
    if (!(await confirm(`Sign data for ${origin}`, [["Encoding", encoding], ["Bytes", String(bytes.length)], ["Preview", String(data).slice(0, 80)]]))) {
      throw rejected();
    }
    const { unshieldedKeystore } = await deriveKeys();
    const sig = unshieldedKeystore.signData(signedMessageBytes(bytes)) as any;
    const vk = unshieldedKeystore.getPublicKey() as any;
    // ledger-v9 tags keys and signatures. The connector types are plain strings.
    return { data, signature: sig.value ?? sig, verifyingKey: vk.value ?? vk };
  },

  // ProvingProvider proxy. The page sends the key material with each call.
  async getProvingProvider() {
    return null;
  },
  async provingProviderCheck(_origin, [preimage, _keyLocation, material]) {
    const km = material && { proverKey: material.proverKey, verifierKey: material.verifierKey, ir: material.zkir };
    const o = await getSyncOptions();
    if (o.provingStrategy === "browser") return checkWithKeyMaterial(preimage, km);
    return ledger.parseCheckResult(await proofServer(o.provingServerUrl, "/check", ledger.createCheckPayload(preimage, material?.zkir)));
  },
  async provingProviderProve(_origin, [preimage, _keyLocation, material, overwriteBindingInput]) {
    const km = material && { proverKey: material.proverKey, verifierKey: material.verifierKey, ir: material.zkir };
    const obi = overwriteBindingInput === undefined ? undefined : BigInt(overwriteBindingInput);
    const o = await getSyncOptions();
    if (o.provingStrategy === "browser") return proveWithKeyMaterial(preimage, km, obi);
    return proofServer(o.provingServerUrl, "/prove", ledger.createProvingPayload(preimage, obi, km));
  },
};

async function proofServer(baseUrl: string, path: string, payload: Uint8Array) {
  const r = await fetch(baseUrl + path, { method: "POST", body: payload as any, headers: { "content-type": "application/octet-stream" } });
  if (!r.ok) throw new Error(`proof server ${path}: ${r.status} ${r.statusText}`);
  return new Uint8Array(await r.arrayBuffer());
}

/** The only methods of the initial API. All other methods need a grant. */
const OPEN_WITHOUT_GRANT = new Set(["connect", "getConnectionStatus"]);

export type ConnectorEnvelope = { ok: true; result: string } | { ok: false; error: { code: ErrorCode; reason: string } };

export async function connectorCall(origin: string, method: string, encodedArgs: string): Promise<ConnectorEnvelope> {
  try {
    const handler = Object.hasOwn(handlers, method) ? handlers[method] : undefined;
    if (!handler) throw new ConnectorError("InvalidRequest", `connector method not supported: ${method}`);
    if (!OPEN_WITHOUT_GRANT.has(method) && !(await isGranted(origin))) {
      throw new ConnectorError("PermissionRejected", `${origin} is not connected; call connect(networkId) first`);
    }
    const args = encodedArgs ? decodeBigintJson<unknown>(encodedArgs) : [];
    return { ok: true, result: encodeBigintJson(await handler(origin, Array.isArray(args) ? args : [])) };
  } catch (e: any) {
    return { ok: false, error: { code: e instanceof ConnectorError ? e.code : "InternalError", reason: String(e?.message ?? e) } };
  }
}
