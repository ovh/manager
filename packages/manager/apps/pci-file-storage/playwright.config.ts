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
    url:
      'http://localhost:9000/#/public-cloud/pci/projects/85581adf7a784e74b21edc9a6fe2071d/file-storage/BHS1.PREPROD/d5226d48-c493-466d-8fb7-b1810579fc8b',
  },
});
