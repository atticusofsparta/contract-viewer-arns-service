import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({
    // Whether to polyfill `node:` protocol imports.
    protocolImports: true,
  })],
  build: {
    manifest: true,
},
  base: './',
  define: {
    'process.env': process.env,
    VITE_CONFIG: {
      version: JSON.stringify(process.env.npm_package_version),
    },
  },
  optimizeDeps: {
    exclude: ['vm2'],
  },
})
