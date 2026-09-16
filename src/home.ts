// MetaMask home page (endowment:page-home). The page reads snap state only and does not sync when it
// opens: onHomePage and onUserInput have 60 s, not the 180 s of an RPC request. Buttons start network work.
import type { OnHomePageHandler, OnUserInputHandler } from "@metamask/snaps-sdk";
import { UserInputEventType } from "@metamask/snaps-sdk";
import { Box, Button, Checkbox, Copyable, Divider, Dropdown, Field, Form, Heading, Input, Option, Row, Text } from "@metamask/snaps-sdk/jsx";
import { DEFAULT_PROVING_SERVER_URL, getState, loadNetwork, NETWORK, NETWORK_IDS, PROVING_PARAMS_URL, setNetwork } from "./config";
import { deriveKeys } from "./keys";
import { listGrants, revokeGrant } from "./connector";
import { addressesFromKeys, getSyncOptions, isWalletBusy, readTrace, registerDust, setSyncOptions, sync, transfer, type HomeSummary } from "./wallet";
import { decimalsOf, dust, night, parseUnits } from "./units";
import * as ledger from "@midnightntwrk/ledger-v9";

const ago = (t: number) => {
  const s = Math.round((Date.now() - t) / 1000);
  return s < 60 ? `${s}s ago` : s < 3600 ? `${Math.round(s / 60)}m ago` : `${Math.round(s / 3600)}h ago`;
};

export const nightOf = (home: HomeSummary, kind: "shielded" | "unshielded") => home[kind];

/** The full page. `status` is the message below the heading. */
async function page(status?: string) {
  const home = await getState<HomeSummary>(`homes.${NETWORK.networkId}`);
  const sites = await listGrants();
  const opts = await getSyncOptions();
  const trace = (await readTrace()).slice(-10);

  let addresses: ReturnType<typeof addressesFromKeys> | null = null;
  try {
    addresses = addressesFromKeys(await deriveKeys());
  } catch (e) {
    status ??= `Could not derive addresses: ${String(e)}`;
  }

  return Box({
    children: [
      Heading({ children: `Midnight (${NETWORK.networkId})` }),
      status ? Text({ children: status }) : null,

      home
        ? Box({
            children: [
              Row({ label: "Unshielded", children: Text({ children: night(nightOf(home, "unshielded")) }) }),
              Row({ label: "Shielded", children: Text({ children: night(nightOf(home, "shielded")) }) }),
              Row({ label: "Spendable", children: Text({ children: dust(home.dust) }) }),
              ...(home.names?.length ? [Row({ label: "Names", children: Text({ children: home.names.join(", ") }) })] : []),
              Row({ label: "Last sync", children: Text({ children: `${ago(home.at)}${home.synced ? "" : " (incomplete)"}` }) }),
            ],
          })
        : Text({ children: "Not synced yet. Press Sync now." }),

      Box({ children: [Button({ name: "sync", children: "Sync now" }), Button({ name: "registerDust", children: "Register NIGHT for DUST" })] }),
      Divider({}),

      addresses
        ? Box({
            children: [
              Text({ children: "Unshielded address" }),
              Copyable({ value: addresses.unshielded }),
              Text({ children: "Shielded address" }),
              Copyable({ value: addresses.shielded }),
              Text({ children: "DUST public key" }),
              Copyable({ value: addresses.dustPublicKey }),
            ],
          })
        : null,

      Divider({}),
      Heading({ children: "Send" }),
      Form({
        name: "send",
        children: [
          Field({ label: "Kind", children: Dropdown({ name: "kind", children: [Option({ value: "unshielded", children: "unshielded" }), Option({ value: "shielded", children: "shielded" })] }) }),
          Field({ label: "Recipient", children: Input({ name: "to", type: "text", placeholder: "mn_addr_… / mn_shield-addr_… / name.night" }) }),
          Field({ label: "Amount (NIGHT, or units of another token)", children: Input({ name: "amount", type: "text", placeholder: "1.5" }) }),
          Field({ label: "Token hex (optional)", children: Input({ name: "token", type: "text", placeholder: "defaults to NIGHT" }) }),
          Button({ type: "submit", name: "submit", children: "Send" }),
        ],
      }),

      Divider({}),
      Heading({ children: "Connected sites" }),
      ...(sites.length
        ? sites.map((site) => Row({ label: site.replace(/^https?:\/\//, "").slice(0, 40), children: Button({ name: `revoke:${site}`, children: "Revoke" }) }))
        : [Text({ children: "No dApp is connected on this network." })]),

      Divider({}),
      Form({
        name: "network",
        children: [
          Field({ label: "Network", children: Dropdown({ name: "networkId", value: NETWORK.networkId, children: NETWORK_IDS.map((id) => Option({ value: id, children: id })) }) }),
          Button({ type: "submit", name: "switch", children: "Switch network" }),
        ],
      }),
      Checkbox({ name: "shieldedFast", variant: "toggle", checked: opts.shieldedFast, label: "Fast shielded sync" }),

      Divider({}),
      Heading({ children: "Proving" }),
      Form({
        name: "proving",
        children: [
          Field({
            label: "Prove with",
            children: Dropdown({
              name: "provingStrategy",
              value: opts.provingStrategy,
              children: [Option({ value: "browser", children: "In MetaMask (nothing to install, slower)" }), Option({ value: "server", children: "Proof server" })],
            }),
          }),
          Field({ label: "Proof server URL", children: Input({ name: "provingServerUrl", type: "text", value: opts.provingServerUrl, placeholder: DEFAULT_PROVING_SERVER_URL }) }),
          Field({ label: "Proving params URL (in MetaMask; must allow CORS)", children: Input({ name: "provingParamsUrl", type: "text", value: opts.provingParamsUrl, placeholder: PROVING_PARAMS_URL }) }),
          Button({ type: "submit", name: "saveProving", children: "Save proving settings" }),
        ],
      }),

      Divider({}),
      Text({ children: "Recent activity" }),
      ...(trace.length ? trace.map((l) => Text({ children: l })) : [Text({ children: "(nothing yet)" })]),
    ].filter(Boolean) as any,
  });
}

export const onHomePage: OnHomePageHandler = async () => {
  await loadNetwork();
  return { id: await snap.request({ method: "snap_createInterface", params: { ui: await page() } }) };
};

const update = async (id: string, status?: string) => {
  await snap.request({ method: "snap_updateInterface", params: { id, ui: await page(status) } });
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  try {
    await loadNetwork();
    const button = event.type === UserInputEventType.ButtonClickEvent ? event.name : undefined;
    const form = event.type === UserInputEventType.FormSubmitEvent ? event.name : undefined;
    const values = (event.type === UserInputEventType.FormSubmitEvent ? event.value : {}) as Record<string, string | null>;

    if (button?.startsWith("revoke:")) {
      const site = button.slice("revoke:".length);
      return await update(id, (await revokeGrant(site)) ? `Revoked ${site}. It must connect again.` : `${site} was not connected.`);
    }
    if (form === "network") {
      const networkId = String(values.networkId ?? "");
      if (networkId === NETWORK.networkId) return await update(id, `Already on ${networkId}.`);
      return await update(id, `Switched to ${(await setNetwork(networkId)).networkId}. Press Sync now.`);
    }
    if (form === "proving") {
      const o = await setSyncOptions({
        provingStrategy: values.provingStrategy ?? undefined,
        // An empty field sets the default.
        provingServerUrl: values.provingServerUrl?.trim() || DEFAULT_PROVING_SERVER_URL,
        provingParamsUrl: values.provingParamsUrl?.trim() || PROVING_PARAMS_URL,
      });
      return await update(id, o.provingStrategy === "browser" ? "Proving in MetaMask." : `Proving with ${o.provingServerUrl}.`);
    }
    // A home page event has 60 s. If it waits for a long session and times out, MetaMask stops the snap.
    if ((button === "sync" || button === "registerDust" || form === "send") && isWalletBusy()) {
      return await update(id, "The wallet is busy with another request. Try again later.");
    }
    if (button === "sync") {
      await update(id, "Syncing…");
      const r = await sync();
      return await update(id, "error" in r ? `Sync failed: ${r.error}` : r.synced ? "Synced." : "Sync is not complete. Try again.");
    }
    if (button === "registerDust") {
      await update(id, "Registering NIGHT for DUST…");
      const r = await registerDust();
      return await update(id, "txId" in r ? `Registered ${r.registered} UTXO(s), tx ${r.txId}` : `Already registered (${r.alreadyRegistered} UTXOs).`);
    }
    if (event.type === UserInputEventType.InputChangeEvent && event.name === "shieldedFast") {
      const o = await setSyncOptions({ shieldedFast: event.value === true });
      return await update(id, `Fast shielded sync ${o.shieldedFast ? "on" : "off"}.`);
    }
    if (form === "send") {
      await update(id, "Building transaction…");
      const token = values.token?.trim() || ledger.nativeToken().raw;
      const r = await transfer({
        type: values.kind === "shielded" ? "shielded" : "unshielded",
        to: String(values.to ?? ""),
        amount: parseUnits(String(values.amount ?? ""), decimalsOf(token)).toString(),
        token,
      });
      return await update(id, `Sent. tx ${r.txId}`);
    }
  } catch (e) {
    // Show the error on the page. A thrown error closes the interface.
    await update(id, `Error: ${e instanceof Error ? e.message : String(e)}`).catch(() => undefined);
  }
};
