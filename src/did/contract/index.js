// Stands in for @midnight-ntwrk/midnight-did-contract 0.5.0 (pnpm-workspace.yaml overrides it with this directory).
// @midnight-ntwrk/midnight-did uses the package only for the ledger types and three enums. The published bindings are
// for ledger 8 (compact-runtime 0.16), so these are made again for ledger 9 from the same did.compact:
//   midnightntwrk/midnight-did 438c3d3 (did.compact equal to 0.5.0), with `as JubjubScalar` on the two ecMul calls in
//   packages/jubjub-schnorr/src/schnorr.compact, then in packages/contract:
//   compact compile +0.34.0 --skip-zk src/did.compact <out>   and copy <out>/contract/index.{js,d.ts} to managed/
export * as DIDContract from "./managed/index.js";
