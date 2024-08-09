import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 3,
  fullyParallel: false,
  timeout: 30 * 1000,
  reporter: [['html', { open: 'on-failure' }]],
  expect: {
    timeout: 20000,
  },
  use: {
    // Collect trace when retrying the failed test.
    trace: 'retain-on-failure',
  },
  testMatch: '**/*.e2e.ts',
  webServer: {
    command: 'yarn run dev',
    url: 'http://localhost:9000/',
  },
});
