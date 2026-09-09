module.exports = {
  preset: '@metamask/snaps-jest',
  testTimeout: 180000,
  transform: { '^.+\\.ts$': '@swc/jest' },
};
