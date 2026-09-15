#!/usr/bin/env bash
# Copy the proving keys and SRS files that the snap's circuits need into params/, with the same paths.
# Paths come from KEY_PATHS and getParams in src/proving/browserProving.ts.
#
#   scripts/mirror-proving-params.sh                                 # keys and SRS k=13,14,15 (29 MB)
#   SRS_K="$(seq -s ' ' 0 17)" scripts/mirror-proving-params.sh      # the full mirror; small dApp circuits need k < 8
#   node scripts/serve-params.mjs 8099                               # serve params/ with CORS headers
set -euo pipefail
SRC="${SRC:-https://midnight-s3-fileshare-dev-eu-west-1.s3.eu-west-1.amazonaws.com}"
OUT="${OUT:-$(cd "$(dirname "$0")/.." && pwd)/params}"
SRS_K="${SRS_K:-13 14 15}"

files=()
for p in zswap/9/spend zswap/9/output zswap/9/sign dust/9/spend; do
  files+=("$p.prover" "$p.verifier" "$p.bzkir")
done
for k in $SRS_K; do files+=("bls_midnight_2p$k"); done

for f in "${files[@]}"; do
  dst="$OUT/$f"
  mkdir -p "$(dirname "$dst")"
  if [ -s "$dst" ]; then echo "have $f"; continue; fi
  echo "get  $f"
  curl -fsSL --retry 3 -o "$dst.part" "$SRC/$f"
  mv "$dst.part" "$dst"
done
du -sh "$OUT"
