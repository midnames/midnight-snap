import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: { target: 'es2022' },
  // A development snap build answers the wallet methods on localhost only.
  server: { host: '127.0.0.1', port: 5176, strictPort: true },
});
