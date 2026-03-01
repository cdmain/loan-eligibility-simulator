import { defineConfig } from '@rsbuild/core'
import { pluginVue } from '@rsbuild/plugin-vue'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'

const isGHPages = process.env.GITHUB_PAGES === 'true'
const repoName = process.env.REPO_NAME || 'loan-eligibility-simulator'

export default defineConfig({
  plugins: [
    pluginVue(),
    pluginModuleFederation({
      name: 'loan_simulator',
      exposes: {
        './app': './src/entry.ts',
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
    port: 3001,
    host: '0.0.0.0',
  },
  output: {
    assetPrefix: isGHPages ? `/${repoName}/` : 'auto',
  },
})
