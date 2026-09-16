import { CustomDustWallet, type DustWalletClass } from "@midnightntwrk/wallet-sdk-dust-wallet";
import { V1Builder, type DefaultV1Configuration } from "@midnightntwrk/wallet-sdk-dust-wallet/v1";
import { largestCoinFirst } from "./coinSelection";
import { makeDustFastSyncCapability, makeDustFastSyncService, type DustFastSyncConfiguration } from "./dustSync.ts";

export type FastSyncDustConfiguration = DefaultV1Configuration & DustFastSyncConfiguration;

/** `DustWallet` with the rebuild path and largest-coin-first selection. Without `rebuild` it syncs as `DustWallet`. */
export const FastSyncDustWallet = (configuration: FastSyncDustConfiguration): DustWalletClass =>
  CustomDustWallet(configuration, new V1Builder()
    .withDefaults()
    .withSync(makeDustFastSyncService, makeDustFastSyncCapability)
    .withCoinSelection(largestCoinFirst as never)) as unknown as DustWalletClass;
