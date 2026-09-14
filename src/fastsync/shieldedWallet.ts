import { CustomShieldedWallet, type ShieldedWalletClass } from "@midnightntwrk/wallet-sdk-shielded";
import { V1Builder, type DefaultV1Configuration } from "@midnightntwrk/wallet-sdk-shielded/v1";
import { makeShieldedFastSyncCapability, makeShieldedFastSyncService, type ShieldedFastSyncConfiguration } from "./shieldedSync.ts";

export type FastSyncShieldedConfiguration = DefaultV1Configuration & ShieldedFastSyncConfiguration;

/**
 * `ShieldedWallet` with viewing-key sync. Only sync is different from the stock wallet.
 * The saved state has the same shape, but its offset is a zswap index, not a ledger event id.
 * Do not restore a state from one sync mode in the other mode.
 */
export const FastSyncShieldedWallet = (configuration: FastSyncShieldedConfiguration): ShieldedWalletClass =>
  CustomShieldedWallet(
    configuration,
    new V1Builder().withDefaults().withSync(makeShieldedFastSyncService, makeShieldedFastSyncCapability),
  ) as unknown as ShieldedWalletClass;
