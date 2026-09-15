import wasm from 'vite-plugin-wasm';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [wasm()],
  define: { global: 'globalThis' },
  // The dep optimizer breaks wasm-bindgen glue. Load these packages as real ESM.
  optimizeDeps: { exclude: ['@midnightntwrk/ledger-v9', '@midnightntwrk/onchain-runtime-v4'] },
  build: { target: 'es2022' },
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
});
