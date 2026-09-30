# Fast sync

This folder has sync paths that are faster than the stock wallet SDK sync.

## Dust

The dust sync service selects one path each time the wallet opens:

| Path | Condition | Work |
|---|---|---|
| Stock | The saved state is at most `dustCatchUpMinGapMs` old. | The stock SDK sync. It replays the dust events after the saved state. |
| Rebuild | No saved state, or a saved state that is older. | `dustRebuild.ts`, then the stock sync from the rebuilt block. |

If the rebuild fails, the stock path runs.

A new wallet must not use the stock path. It replays every dust event of the chain (52k on stagenet in
September 2026), MetaMask delivers each WebSocket message to the snap as a separate request with a 60 s
limit, and the snap executor stops before the sync ends.

The rebuild is the "eventless" sync of `wallet-sdk-dust-wallet` 5.0.0-rc.0 (`v2/Sync.ts`), written for
ledger-v9 rc.3:

1. Find the latest dust alignment block: the event id and the tree frontiers of its last dust transaction.
2. `dustGenerations` at that block sends the wallet's generations, the decay time updates, and collapsed
   updates for the other leaves of the generation tree.
3. Follow each generated output through its spends with `dustNullifierTransactions`. A spend gives a
   successor output with a new nullifier, so each round looks up the nullifiers of the last round.
4. Put the unspent outputs in the commitment tree, with collapsed updates for the other leaves.
5. Compare both tree roots with the roots of the block. If they are different, the rebuild fails.

A rebuild does not keep the booked coins of pending spends. It runs only after 1 hour, and the snap's
transactions have a 1 hour TTL.

Measured in Node on stagenet: a new wallet in 3 to 5 s and 6 messages, a wallet with 36 spends in 9 s
and 61 messages. The stock sync of the same new wallet takes 131 s and approximately 52k messages.

## Shielded

With `shieldedFast`, the wallet sends its viewing key to the indexer and receives only its own
transactions. The indexer can then read all shielded history of the wallet.

A fast shielded state and a stock shielded state have different offsets. When the mode changes, the
wallet syncs shielded coins again from zero. If the fast sync fails, the stock sync runs only for an empty state.

### Origin

With an origin, the fast shielded sync starts at the origin's zswap index. Record an origin only for an
account that never held funds. The sync skips all history before the origin, so for an account with funds
the balances are wrong, and no error occurs. The snap cannot know if an account is new, because the
MetaMask phrase can be old. For this reason, only `midnight_recordSyncOrigin` records an origin, and the
user must confirm it.

## Indexer limits

These values were measured. Do not change them without a new measurement.

- `dustNullifierTransactions` returns no result for an 8-byte nullifier prefix.
  The code uses 6 bytes.
- `dustNullifierTransactions` does not end without `toBlock`.
- More than approximately 12 concurrent `dustLedgerEvents` reads stop `indexer-api` on a 2 vCPU host.
  The code uses 4.
- The indexer refuses 32 aliased blocks in one query ("Query is too complex"). The code uses 16.

## Not verified on ledger-v9

- The `RelevantTransaction` branch of the shielded fast sync with a wallet that has shielded history.

## Live check

`pnpm check:fastsync [indexerHttpUrl]` checks the pure logic, runs the origin and alignment queries, and rebuilds
the dust state of a new random wallet against the indexer. It needs no keys and spends nothing.
