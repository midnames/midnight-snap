# @midnames/midnight-snap-connector

This package adds the [Midnight Snap](../) to `window.midnight` as a
`@midnight-ntwrk/dapp-connector-api` 4.0.1 `InitialAPI`. A dApp can then find and use the snap
as it uses other Midnight wallets.

A snap cannot add code to a page, so the page must load this package. Load it as early as possible,
because dApps read `window.midnight` when they start.

## Install

```sh
npm install @midnames/midnight-snap-connector
```

## Use

Register with the default options:

```ts
import '@midnames/midnight-snap-connector/auto';
```

Register with options:

```ts
import { registerMidnightSnap } from '@midnames/midnight-snap-connector';

const wallet = registerMidnightSnap({
  snapId: 'local:http://localhost:8093', // a development build from `pnpm serve`
});
```

Use the returned `wallet`, or find the wallet as for other wallets:

```ts
const wallet = Object.values(window.midnight ?? {}).find((w) => w.rdns === 'com.midnames.midnight-snap');
const api = await wallet.connect('stagenet');
const { unshieldedAddress } = await api.getUnshieldedAddress();
```

The package follows the installation rules of the specification:

- If `window.midnight` does not exist, the package creates it as non-writable and non-configurable.
- The package adds the wallet under a new UUIDv4 key. Do not find the wallet by its key.
- `registerMidnightSnap` is synchronous. When two bundles register the same snap id, the second call
  returns the first API. The wallet does not show two times.

`createMidnightSnapApi(options)` returns the same `InitialAPI` and does not change `window.midnight`.

## Options

| Option | Default | Description |
|---|---|---|
| `snapId` | `globalThis.MIDNIGHT_SNAP_ID`, else `npm:@midnames/midnight-snap` | The snap to call. |
| `version` | — | Minimum snap version for `wallet_requestSnaps`. |
| `rdns` | `com.midnames.midnight-snap` | Wallet id for a wallet selector. |
| `name` | `Midnight Snap` | Wallet name for a wallet selector. |
| `icon` | built-in SVG | Wallet icon for a wallet selector. |

## Notes

- The package finds MetaMask with EIP-6963, not with `window.ethereum`. When other wallets are
  installed, `window.ethereum` is frequently a different wallet. The search occurs at the first call.
- `connect()` installs the snap only if it is not installed, because each `wallet_requestSnaps`
  shows a MetaMask window. With `version`, `connect()` always requests the snap.
- `signData` signs `midnight_signed_message:<byte length>:` followed by the data, as the
  specification requires. Verify the signature against these bytes.
- Errors are `APIError`s: an `Error` with `type: 'DAppConnectorAPIError'`, `code` and `reason`.
  Check `error.code`. Do not use `instanceof`. When the user refuses a MetaMask request
  (EIP-1193 code `4001`), the code is `Rejected`.
- A snap request stops after 180 s. A shielded transfer that is proved in MetaMask can take almost
  this time. For shielded transfers, the user can select a proof server on the snap home page.
- `connect()` asks the user one time for each site and network. Each transaction asks again.
