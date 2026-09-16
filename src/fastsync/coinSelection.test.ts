import { largestCoinFirst } from './coinSelection';

it('takes the largest coin of the token type, not the smallest', () => {
  const coins = [
    { type: 'dust', value: 17_104_423_000_000n },
    { type: 'dust', value: 20_000_000_000_000_000_000n },
    { type: 'night', value: 99_000_000_000_000_000_000_000n },
    { type: 'dust', value: 104_647_689_387_418_526n },
  ];
  expect(largestCoinFirst()(coins, 'dust')).toBe(coins[1]);
  expect(largestCoinFirst()([], 'dust')).toBeUndefined();
});
