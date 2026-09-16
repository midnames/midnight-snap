# Midnight Snap

A Midnight wallet that runs in MetaMask as a Snap. The snap does these operations:

- It derives Midnight keys from the MetaMask secret recovery phrase. The derivation is the same as in
  `@midnightntwrk/wallet-sdk-hd`, so the addresses are the same as in other Midnight wallets.
- It syncs shielded, unshielded and DUST balances from the Midnight indexer.
- It registers NIGHT for DUST generation.
- It sends shielded and unshielded transfers. It makes the proofs in MetaMask or on a proof server.
- It implements the dApp Connector API 4.0.1 (`@midnight-ntwrk/dapp-connector-api`).
- It resolves Midnames (MidNS) names such as `alice.night`, and it sends to them.
- It resolves `did:midnight` DIDs to DID documents (`@midnight-ntwrk/midnight-did`).

The snap supports `stagenet` and a local Midnight network (`undeployed`). It uses
`snap_getBip32Entropy`, so MetaMask stable accepts it only after an allowlist review and an audit.
Until then, use MetaMask Flask.

## Contents

| Path | Contents |
|---|---|
| `src/` | The snap. |
| `src/fastsync/` | Fast sync. Refer to [src/fastsync/README.md](src/fastsync/README.md). |
| `src/proving/` | Proving in MetaMask. Refer to [src/proving/README.md](src/proving/README.md). |
| `src/midns/` | The MidNS contract source and its bindings. Refer to [Names](#names-midns). |
| `src/did/contract/` | Ledger-9 bindings of the midnight-did contract. Refer to [DIDs](#dids). |
| `patches/` | Adds the `stagenet` network to `@midnight-ntwrk/midnight-did-domain`. Refer to [DIDs](#dids). |
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

- The balances, the time of the last sync, and the MidNS names of the account with the DID of each name.
- The unshielded address, the shielded address and the DUST public key.
- **Sync now** and **Register NIGHT for DUST**.
- A **Send** form. The recipient can be an address or a MidNS name.
- The sites that are connected on the active network, each with **Revoke**.
- The network selector and the **Fast shielded sync** switch.
- The **Proving** settings.
- The last 10 lines of the activity trace.

The home page reads only snap state, and it does not sync when it opens. MetaMask gives the home
page 60 s for each event, and a sync can take longer. The buttons start the network operations.

## Networks

| Network | Indexer | Node | MidNS contract |
|---|---|---|---|
| `stagenet` | `indexer.stagenet.shielded.tools` | `rpc.stagenet.shielded.tools` | `7aae593f…a068bd` |
| `undeployed` | `127.0.0.1:8088` | `127.0.0.1:9944` | none |

`SNAP_NETWORK` sets the default network at build time. To change the network, use the home page or
`midnight_setNetwork`. The user must confirm the change. The snap keeps wallet state, the home page
summary and dApp connections separately for each network.

## Names (MidNS)

MidNS is the Midnames name service. Its contract maps names such as `alice.night` to a target and to text fields.
`src/midns.ts` reads the contract state from the indexer and decodes it with the bindings in `src/midns/contract/`.

- **Name to address.** `midnight_transfer` and the home page **Send** form accept a name as the recipient. The snap
  resolves the name before it opens the wallet, and the confirmation shows the name and the address.
  - An unshielded transfer goes to the target, if the target is an unshielded address.
  - A shielded transfer goes to the target coin public key and the encryption key in the `epk` field.
  - Other names fail with an error.
- **Address to names.** Each sync finds the names whose target or owner is this account, and the home page shows them.
  The contract has no index by address, so the snap reads all names.

The `@midnames/sdk` contracts are for ledger 8. The snap uses ledger 9, so it uses its own deployment on stagenet. That deployment is for tests: its root domain secret is public, and anyone can
manage names under `night`. The `snap.night` name points to a test wallet.

`src/midns/ns.compact` is `ns.compact` from `@midnames/sdk` 2.0.2, with `pragma language_version >= 0.22`. To make
the bindings again:

```sh
compact compile +0.34.0 --skip-zk src/midns/ns.compact src/midns
```

## DIDs

`src/did.ts` resolves `did:midnight:<network>:<contract address>` with `MidnightDIDResolver` from
`@midnight-ntwrk/midnight-did` 0.5.0 (midnightntwrk/midnight-did). The result is a W3C DID resolution result: the DID
document, its metadata, and `didResolutionMetadata.error` (for example `notFound`) if the resolution fails.

- The resolver does not decode contract state itself. The snap reads the state from the indexer and decodes it with
  `src/did/contract/`. The published `@midnight-ntwrk/midnight-did-contract` bindings are for ledger 8, so
  `pnpm-workspace.yaml` replaces that package with `src/did/contract/`: bindings of the same `did.compact`, made
  with Compact 0.34.0. `src/did/contract/index.js` tells how to make them again.
- The DID method has no `stagenet` network. `patches/@midnight-ntwrk__midnight-did-domain@0.5.0.patch` adds it.
- A MidNS name links to a DID with its `did` field. The home page shows the DID of each name of the account.

On stagenet, `snap.night` links to the test DID
`did:midnight:stagenet:f63ba2791972e511dccca154d75df67ed22cdaccb3d01f539fbfbeda0eb07679`. The DID has a `midns` service
that names `snap.night`, so the link goes in both directions. Its controller secret is public: it is for tests only.

The snap does not create or update DIDs yet.

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
| `midnight_transfer` | `{ type: "shielded" \| "unshielded", to, amount, token? }`; `to` can be a name | yes |
| `midnight_resolveName` | `{ name }` | no |
| `midnight_resolveDid` | `{ did }` | no |
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
| `homes.<networkId>` | The balances and the MidNS names that the home page shows. |
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
- The bundle is approximately 29 MB, because it includes the ledger, onchain-runtime, zkir-v2 and zkir-v3 WebAssembly.
