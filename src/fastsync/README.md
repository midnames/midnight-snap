# Fast sync

This folder has sync paths that are faster than the stock wallet SDK sync.

## Dust

The dust sync service selects one path each time the wallet opens:

| Path | Condition | Work |
|---|---|---|
| Full | No origin and no anchor. | The stock SDK sync. It replays all dust events. |
| Origin | The account has an origin and the wallet applied no events. | 2 collapsed updates, then the events after the origin. |
| Catch-up | The saved state has an anchor, and the gap is longer than `dustCatchUpMinGapMs`. | 1 alignment scan, then approximately 1 round trip for each block with a spend of this wallet. |

If the origin path or the catch-up path fails, the full path runs.

The anchor is saved with the wallet state. The first anchor is recorded when a save occurs and the
saved dust trees end at the latest dust alignment of the indexer.

### Origin

Record an origin only for an account that never held funds. The sync skips all history before the
origin, so for an account with funds the balances are wrong, and no error occurs. The snap cannot
know if an account is new, because the MetaMask phrase can be old. For this reason, only
`midnight_recordSyncOrigin` records an origin, and the user must confirm it.

## Shielded

With `shieldedFast`, the wallet sends its viewing key to the indexer and receives only its own
transactions. The indexer can then read all shielded history of the wallet.

A fast shielded state and a stock shielded state have different offsets. When the mode changes, the
wallet syncs shielded coins again from zero. If the fast sync fails, the stock sync runs only for an empty state.

## Indexer limits

These values were measured. Do not change them without a new measurement.

- `dustNullifierTransactions` returns no result for an 8-byte nullifier prefix.
  The code uses 6 bytes.
- `dustNullifierTransactions` does not end without `toBlock`.
- More than approximately 12 concurrent `dustLedgerEvents` reads stop `indexer-api` on a 2 vCPU host.
  The code uses 4.
- The indexer refuses 32 aliased blocks in one query ("Query is too complex"). The code uses 16.
- `dustGenerations` sends nothing and does not end when the range has no data for the address. The
  code stops it after 8 s of silence.

## Not verified on ledger-v9

- The catch-up path with a funded wallet (spend scan, one block per round, `dustGenerations`).
- The `RelevantTransaction` branch of the shielded fast sync with a wallet that has shielded history.

## Live check

`pnpm check:fastsync [indexerHttpUrl]` checks the pure logic and runs the origin and alignment queries against
the indexer. It needs no keys and spends nothing.
