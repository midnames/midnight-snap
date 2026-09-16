/**
 * Dust coin selection: the largest coin first.
 *
 * The SDK default (`chooseCoin` in wallet-sdk-dust-wallet 5.0.0-beta.2) takes the smallest coin first. After some
 * fee-paying transactions the wallet holds change coins with almost no DUST, and fee balancing then fails with the
 * wasm error "unreachable" instead of adding a larger coin. Seen on stagenet on 2026-09-16: after 8 transactions in a
 * row every new transaction failed, with a 20 DUST coin available.
 */
export const largestCoinFirst =
  () =>
  <C extends { type: string; value: bigint }>(coins: readonly C[], tokenType: string): C | undefined =>
    coins
      .filter((c) => c.type === tokenType)
      .sort((a, b) => (a.value < b.value ? 1 : a.value > b.value ? -1 : 0))
      .at(0);
