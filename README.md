# Midnight Snap Installation

Overview on the installation of Midnight Metamask Snap.

### Prerequisites

- node --version // ^20 or >=22, required by @metamask/snaps-cli
- pnpm --version // 12.4.2, pinned by "packageManager"
- MetaMask Flask

### 0. Clone the repository

Switch to your expected directory and clone the Midnight Snap Repository

```
cd <your-repo-directory>
git clone git@github.com:midnames/midnight-snap.git <repo-folder-name>
```

### 1. Install dependencies + build

Once the repository is cloned, navigate to the folder and install required usage dependencies

```
cd <repo-folder-name>
pnpm install
pnpm run build
```

The build writes `dist/bundle.js` and refreshes `source.shasum` in `snap.manifest.json` for integrity check.

### 2. Metamask Connection

After building the Midnight Snap, connect it to the Metamask Flask extension.

Start the local Snap server and leave it running in its own terminal.
Flask fetches the bundle from it every time the Snap is installed or reinstalled

```
pnpm run serve
```

This serves `snap.manifest.json` and `dist/bundle.js` on port `8091` (if available).

To install, open a page served over `http://` or `https://` — your dApp, or any local page — and
run the following in the browser console. MetaMask does not inject `ethereum` into `about:blank`
or `file://` pages, so the console has to be attached to a real origin

```
const SNAP_ID = 'local:http://localhost:8091';

await ethereum.request({
    method: 'wallet_requestSnaps',
    params: { [SNAP_ID]: {} },
});
```

Flask opens a permissions prompt box. Nothing fancy there. <br>Approve it to finish the install.

The Snap never receives your Secret Recovery Phrase. MetaMask derives the `m/44'/2400'` node and
hands over only that, so the Snap can produce Midnight keys and nothing else.

### 3. Verify the installation

Confirm the Snap is installed and responding before testing anything else. Test each functionality provided by the snap witha specific request

#### 3.1 Snap Ping

```
await ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: SNAP_ID, request: { method: 'ping' } },
});

// Expected => { ok: true, ts: 1757937... }
```

#### 3.2 Address derivation

Derive the Midnight addresses for the connected account

```
await ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: SNAP_ID, request: { method: 'midnight_getAccounts' } },
});

// Expected => { shielded: 'mn_shield-addr_undeployed1...',
//      unshielded: 'mn_addr_undeployed1...',
//      dustPublicKey: '...' }
```

#### 3.3 Payload signature

Sign an arbitrary payload. Flask opens a confirmation dialog, and the call resolves once approved

```
await ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: SNAP_ID,
      request: { method: 'midnight_signData', params: { hex: 'deadbeef' } },
    },
});

// Expected => { signature: '...', verifyingKey: '...' }
```

Addresses are currently encoded for the `Undeployed` network, so every address is prefixed
`mn_shield-addr_undeployed1` or `mn_addr_undeployed1`.

### 4. Development loop

Use `watch` instead of `build` to rebuild on every save

```
pnpm run watch
```

Rebuilding changes the bundle shasum, which Flask treats as a new version.

**Reminder:**
reinstall the Snap after each rebuild, either from the Snap's entry under Flask's settings or by calling
`wallet_requestSnaps` again from the console.

### 5. Testing

The test suite runs the full derivation and signing flow against a simulated MetaMask instance with a
fixed test Secret Recovery Phrase. No running snap is needed.

```
pnpm exec jest
```

The address test asserts against known-good values for that phrase, which is what catches an
accidental change to the derivation path. Allow it time on a cold run — the simulated
environment has to load the ledger WebAssembly module, and the timeout is set to 180s.

### Troubleshooting

1. `EADDRINUSE: address already in use :::8091`
   A Snap server is already running on that port. Reuse it, or stop the other process.

2. `wallet_requestSnaps` is undefined, or `ethereum` is undefined
   The page is not a real origin, or you are in regular MetaMask rather than Flask.

3. Snap installs but the code is stale The bundle was rebuilt without reinstalling. Reinstall so Flask picks up the new shasum.
