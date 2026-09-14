# Midnight Snap

A Midnight wallet that runs in MetaMask as a Snap. The snap does these operations:

- It derives Midnight keys from the MetaMask secret recovery phrase. The derivation is the same as in
  `@midnightntwrk/wallet-sdk-hd`, so the addresses are the same as in other Midnight wallets.
- It syncs shielded, unshielded and DUST balances from the Midnight indexer.
- It registers NIGHT for DUST generation.
- It sends shielded and unshielded transfers. It makes the proofs in MetaMask or on a proof server.
- It implements the dApp Connector API 4.0.1 (`@midnight-ntwrk/dapp-connector-api`).

The snap supports `stagenet` and a local Midnight network (`undeployed`). It uses
`snap_getBip32Entropy`, so MetaMask stable accepts it only after an allowlist review and an audit.
Until then, use MetaMask Flask.

## Contents

| Path | Contents |
|---|---|
| `src/` | The snap. |
| `src/fastsync/` | Fast sync. Refer to [src/fastsync/README.md](src/fastsync/README.md). |
| `src/proving/` | Proving in MetaMask. Refer to [src/proving/README.md](src/proving/README.md). |
| `connector/` | `@midnames/midnight-snap-connector`, the package for dApps. Refer to [connector/README.md](connector/README.md). |
| `bridge-extension/` | A Chrome extension that adds the connector to all pages, for tests with dApps that you cannot change. |
| `scripts/` | Proving params mirror, fast sync check, proving benchmark. |
| `test.html` | Manual test page for MetaMask Flask. |

## Build and test

```sh
pnpm install
pnpm build                                          # production build, default network: stagenet
pnpm build:dev                                      # also includes the development RPC methods
SNAP_NETWORK=undeployed pnpm build:dev              # default network: undeployed
pnpm test                                           # makes a development build, then runs the simulator tests
pnpm check:fastsync                                 # live queries to the stagenet indexer
pnpm --filter @midnames/midnight-snap-connector build
pnpm --filter @midnames/midnight-snap-connector test
```

## Try it in MetaMask Flask

1. Install MetaMask Flask.
2. Run `pnpm build:dev` and build the connector (see above). `test.html` uses the development RPC methods.
3. Run `pnpm serve`. The snap id is `local:http://localhost:8093`.
4. In the repository root, run `python3 -m http.server 8095`. Do not open `test.html` as a file:
   the browser does not load modules from `file://`.
5. Open `http://localhost:8095/test.html` and click **connect**. MetaMask asks you to install the snap.

After a rebuild, click **reinstall snap**. The connector does not reinstall a snap that is installed.

## Home page

Open the snap in MetaMask to see its home page. The home page has:

- The balances and the time of the last sync.
- The unshielded address, the shielded address and the DUST public key.
- **Sync now** and **Register NIGHT for DUST**.
- A **Send** form.
- The sites that are connected on the active network, each with **Revoke**.
- The network selector and the **Fast shielded sync** switch.
- The **Proving** settings.
- The last 10 lines of the activity trace.

The home page reads only snap state, and it does not sync when it opens. MetaMask gives the home
page 60 s for each event, and a sync can take longer. The buttons start the network operations.

## Networks

| Network | Indexer | Node |
|---|---|---|
| `stagenet` | `indexer.stagenet.shielded.tools` | `rpc.stagenet.shielded.tools` |
| `undeployed` | `127.0.0.1:8088` | `127.0.0.1:9944` |

`SNAP_NETWORK` sets the default network at build time. To change the network, use the home page or
`midnight_setNetwork`. The user must confirm the change. The snap keeps wallet state, the home page
summary and dApp connections separately for each network.

## Sync

Each operation opens the wallet from snap state, syncs it, does its work, then saves the state and
closes the wallet. Only one operation uses the wallet at a time. Other operations wait.

A cron job syncs every 5 minutes, after the first sync. Because the saved state stays near the chain
tip, other requests restore in some seconds. When the NIGHT balance changes, the cron job shows a
notification.

`midnight_setSyncOptions` and the home page set these options:

| Option | Default | Effect |
|---|---|---|
| `shieldedFast` | `false` | Sync shielded coins through the indexer. The indexer receives the viewing key. |
| `dustCatchUpMinGapMs` | `3600000` | Use dust catch-up only after a longer gap. |
| `provingStrategy` | `"browser"` | `"browser"` proves in MetaMask. `"server"` uses a proof server. |
| `provingServerUrl` | `http://localhost:6300` | The proof server. |
| `provingParamsUrl` | `https://assets.midnames.com` | The host of the proving keys. It must send CORS headers. |

Sync times on stagenet (24k dust events):

| Path | New wallet | Saved state, 5 min old |
|---|---|---|
| Shielded, stock | 15 s | 3.2 s |
| Shielded, fast | 5.3 s | 3.2 s |
| Dust, stock | — | 3.2 s |
| Dust, catch-up with no spends | — | 16 to 18 s |

## Proving

By default the snap makes proofs in MetaMask, so the user does not install a proof server. This is
25 to 40 times slower than a proof server: approximately 10 s for an unshielded transfer and 116 s
for a shielded transfer. A snap request stops after 180 s, so use a proof server for shielded transfers.

A proof server receives the transaction preimages. Thus, when a page changes a proving setting with
`midnight_setSyncOptions`, the user must confirm the change.

## dApp connector

dApps call `midnight_connector` with `{ method, args }`. `args` is a bigint-JSON string
(`src/bigint-json.ts`). The reply is `{ ok: true, result }` or `{ ok: false, error: { code, reason } }`,
because MetaMask removes the `code` from a thrown error. `connector/` converts the reply into the
values and `APIError`s of the specification.

MetaMask dialogs show amounts in NIGHT and DUST. Other tokens show as units of their token type.

A site must call `connect` first. `connect` asks the user one time for each site and network. Each
transaction and each `signData` asks again. `signData` signs
`midnight_signed_message:<byte length>:` followed by the data, as the specification requires.

## Development RPC methods

These methods are only in development builds (`pnpm build:dev`). A production build (`pnpm build`,
also before `npm publish`) answers "Method not found". They answer only pages on `localhost`,
`127.0.0.1` or `[::1]`. The home page gives users the same functions.

| Method | Params | Confirmation |
|---|---|---|
| `ping` | | no |
| `midnight_getAccounts` | | no |
| `midnight_sync` | | no |
| `midnight_transfer` | `{ type: "shielded" \| "unshielded", to, amount, token? }` | yes |
| `midnight_registerDust` | | yes |
| `midnight_signData` | `{ hex }` | yes |
| `midnight_getNetwork` | | no |
| `midnight_setNetwork` | `{ networkId }` | yes |
| `midnight_getSites` | | no |
| `midnight_revokeSite` | `{ origin }` | no |
| `midnight_getSyncOptions` | | no |
| `midnight_setSyncOptions` | part of the options above | for proving options |
| `midnight_recordSyncOrigin` | | yes |
| `midnight_reset` | | yes |
| `midnight_diag` | | no |
| `midnight_trace` | | no |

## Snap state

| Key | Contents |
|---|---|
| `wallets.<networkId>` | Serialized wallets, dust anchor, transaction history. |
| `homes.<networkId>` | The balances that the home page shows. |
| `syncOrigins.<networkId>` | The origin from `midnight_recordSyncOrigin`. |
| `settings` | `networkId` and the sync options that the user set. |
| `origins` | Connected sites: origin to network id. |
| `trace` | The last 40 progress lines. |
| `params` (unencrypted) | Cache of proving keys. |

## Limits and known problems

- A request stops after 180 s. This is the maximum of `endowment:rpc.maxRequestTime`. The snap uses
  165 s and keeps 15 s to save the state.
- On a new snap executor, the first `midnight_transfer` can crash the snap. Sync first.
- The snap sandbox has no `WebSocket`. `src/ws-shim.ts` implements it with `snap_openWebSocket`.
  MetaMask allows one socket for each URL, so the shim adds a `mmws` query parameter to each URL.
- The `effect` package has methods with the name `eval`, and SES refuses the bundle.
  `snap.config.ts` renames them after minification.
- The bundle is approximately 27 MB, because it includes the ledger, zkir-v2 and zkir-v3 WebAssembly.
