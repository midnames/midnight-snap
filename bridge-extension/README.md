# Midnight Snap Bridge

This Chrome extension adds `../connector` to all pages. dApps then find the snap in
`window.midnight` without the package. Use it only for tests with dApps that you cannot change.
In your own dApp, import `@midnames/midnight-snap-connector`.

## Install

```sh
pnpm --filter @midnames/midnight-snap-connector build
cp ../connector/dist/index.js ../connector/dist/auto.js .
```

Then open `chrome://extensions`, enable developer mode and load this folder with **Load unpacked**.

`auto.js` uses the default snap id: `globalThis.MIDNIGHT_SNAP_ID` if the page sets it, else
`npm:@midnames/midnight-snap`. For a local build, change `auto.js` to call
`registerMidnightSnap({ snapId: 'local:http://localhost:8093' })`.
