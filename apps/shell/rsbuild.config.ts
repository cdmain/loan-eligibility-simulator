import { defineConfig } from '@rsbuild/core'
import { pluginVue } from '@rsbuild/plugin-vue'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'

export default defineConfig({
  plugins: [
    pluginVue(),
    pluginModuleFederation({
      name: 'shell',
      remotes: {
        loan_simulator: 'loan_simulator@http://localhost:3001/mf-manifest.json',
      },
      shared: {
        vue: { singleton: true, requiredVersion: '^3.5.0' },
      },
    }),
  ],
  source: {
    entry: {
      index: './src/main.ts',
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  html: {
    template: './index.html',
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
})
