# Proving in MetaMask

With `provingStrategy: "browser"` the snap makes the proofs in MetaMask. The user does not install a
proof server.

## Operation

The SDK's WebAssembly prover (`makeWasmProvingService`) starts a `Worker`, and a snap has no workers.
`browserProving.ts` calls `check` and `prove` of `@midnight-ntwrk/zkir-v2` on the snap thread, with
the same key material.

A dApp circuit that was compiled with `--feature-zkir-v3` goes to the zkir-v3 prover in `zkir-v3/`.
The first bytes of the IR tell which prover to use: `midnight:ir-source[v2]:` or
`midnight:ir-source[v3-generic]:`. The wallet's own circuits are v2.

## Key material

| Key location | Path | Prover key |
|---|---|---:|
| `midnight/zswap/spend` | `zswap/9/spend` | 11.0 MB |
| `midnight/zswap/output` | `zswap/9/output` | 5.7 MB |
| `midnight/zswap/sign` | `zswap/9/sign` | 2.8 MB |
| `midnight/dust/spend` | `dust/9/spend` | 2.2 MB |

Each path has `.prover`, `.verifier` and `.bzkir` files. The SRS files are `bls_midnight_2p<k>`.

| Transaction | Circuits | Download |
|---|---|---:|
| Unshielded transfer, DUST registration | dust spend, SRS k=13 | 3.75 MB |
| Shielded transfer | dust spend, zswap spend, 2 zswap output, SRS k=14 and k=15 | 28.6 MB |

### Host

The host must send `Access-Control-Allow-Origin`. The Midnight S3 bucket
(`midnight-s3-fileshare-dev-eu-west-1`) does not send it, so a fetch from the snap fails there.
The default host is `https://assets.midnames.com`. It has the same paths, the wallet keys, SRS k=8 to
k=17 and a `SHA256SUMS` file.

To make a copy and serve it:

```sh
SRS_K="8 9 10 11 12 13 14 15 16 17" scripts/mirror-proving-params.sh   # into params/
node scripts/serve-params.mjs 8099                                    # sends CORS headers
```

Then set **Proving params URL** on the home page to `http://127.0.0.1:8099`.
`python3 -m http.server` does not send CORS headers, so it does not work.

### Cache

The snap keeps downloaded key material in the unencrypted snap state, key `params`. The wallet state
is in the encrypted snap state, and the cache does not touch it. The cache key is the full URL and
the value is base64. The limit is 48 MB of base64, because the state limit is 64 MB of JSON. When the
cache is full, the oldest entries are removed.

## Measurements

Node 26 on a 16-core desktop, local Midnight network.

| Transaction | zkir wasm | Proof server |
|---|---:|---:|
| Unshielded transfer with DUST fee (1 proof) | 10.4 s | 0.4 s |
| Shielded transfer with DUST fee (4 proofs) | 115.7 s | 3.1 s |
| zkir-v3 contract call, k=15, 55.6 MB prover key | 108.9 s | — |

The prover uses one thread. A shielded transfer is near the 180 s request limit, and it can fail on a
slow computer. A dApp circuit with k=17 does not fit in a request.

Reading the shielded key material from the cache takes approximately 57 ms in Node. This was not
measured in MetaMask.

To measure the wallet transactions again, run `scripts/measure-proving.mjs` against a local network.

## zkir-v3 build

`zkir-v3/` is a wasm-bindgen `bundler` build of `midnight-zkir-v3-wasm` from midnight-ledger tag
`ledger-9.1.0.0-rc.4` (Apache-2.0). Older tags cannot read the IR of current contracts. The build needs
wasm-bindgen 0.2.108 exactly.

```sh
cargo install -f wasm-bindgen-cli --version 0.2.108
cargo build --release --target wasm32-unknown-unknown -p midnight-zkir-v3-wasm
wasm-bindgen --target bundler --out-dir <out> target/wasm32-unknown-unknown/release/midnight_zkir_v3_wasm.wasm
wasm-opt -O --enable-reference-types --enable-bulk-memory -o <out>/midnight_zkir_v3_wasm_bg.wasm <out>/midnight_zkir_v3_wasm_bg.wasm
```

zkir-v3 adds 8.4 MB to the bundle. To remove it, remove the `zkir3` import and the `isV3` branches
in `browserProving.ts`.

## Known problems

- A contract prover key can be larger than the cache (55.6 MB to 222 MB). dApp key material comes
  with each call and is not cached.
- Nothing checks that the zkir-v3 build can read the contracts of a dApp.
- The cache removes entries in insertion order, not in order of use.
