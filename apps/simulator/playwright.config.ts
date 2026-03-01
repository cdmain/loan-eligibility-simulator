import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? 'github' : 'html',

  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // CI uses bundled Chromium; locally use system Chrome
        ...(isCI ? {} : { channel: 'chrome' }),
      },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    port: 3001,
    reuseExistingServer: !isCI,
    timeout: 30_000,
  },
})
