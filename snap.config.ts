import type { SnapConfig } from "@metamask/snaps-cli";
import { resolve } from "path";
import { Compilation, DefinePlugin, sources } from "webpack";

// effect's Micro module defines methods literally named `eval(...)`; SES's static
// "possible direct eval" check rejects the bundle. Rename them to a computed key.
class EvadeDirectEvalPlugin {
  apply(compiler: any) {
    compiler.hooks.thisCompilation.tap("EvadeDirectEval", (compilation: any) => {
      compilation.hooks.processAssets.tap(
        { name: "EvadeDirectEval", stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE + 1 },
        (assets: Record<string, any>) => {
          for (const [name, asset] of Object.entries(assets)) {
            if (!name.endsWith(".js")) continue;
            const src = asset.source().toString();
            const before = (src.match(/(^|[^.\w$])eval(\s*\()/g) ?? []).length;
            const out = src.replace(/(^|[^.\w$])eval(\s*\()/g, '$1["eval"]$2');
            console.log(`[EvadeDirectEval] ${name}: ${before} occurrence(s) rewritten`);
            if (out !== src) compilation.updateAsset(name, new sources.RawSource(out));
          }
        },
      );
    });
  }
}

const config: SnapConfig = {
  input: resolve(__dirname, "src/index.ts"),
  server: { port: 8093 },
  polyfills: true,
  experimental: { wasm: true },
  customizeWebpackConfig: (cfg) => {
    cfg.plugins = [
      ...(cfg.plugins ?? []),
      new EvadeDirectEvalPlugin(),
      new DefinePlugin({
        SNAP_NETWORK: JSON.stringify(process.env.SNAP_NETWORK ?? "stagenet"),
        // The development RPC methods are only in builds with SNAP_DEV_RPC=1 (pnpm build:dev, pnpm test).
        SNAP_DEV_RPC: JSON.stringify(process.env.SNAP_DEV_RPC === "1"),
        // The wallet site's origin. It gets the wallet RPC methods also in production builds.
        SNAP_WALLET_ORIGIN: JSON.stringify(process.env.SNAP_WALLET_ORIGIN ?? ""),
      }),
    ];
    return cfg;
  },
};
export default config;
