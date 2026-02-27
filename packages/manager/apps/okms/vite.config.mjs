import { join, resolve } from 'path';
import { defineConfig } from 'vite';

import { getLogsToCustomerConfig } from '@ovh-ux/logs-to-customer/vite-config';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

const logsToCustomerConfig = getLogsToCustomerConfig();
const baseConfig = getBaseConfig(logsToCustomerConfig);

export default defineConfig({
  ...baseConfig,
  optimizeDeps: {
    ...baseConfig.optimizeDeps,
    // Pre-bundle Monaco to avoid "Failed to fetch dynamically imported module" when loading the JSON editor
    include: [...(baseConfig.optimizeDeps?.include ?? []), 'monaco-editor', '@monaco-editor/react'],
  },
  resolve: {
    ...baseConfig.resolve,
    alias: {
      '@': resolve(join(process.cwd(), 'src')),
      '@secret-manager': resolve(join(process.cwd(), 'src/modules/secret-manager')),
      '@key-management-service': resolve(join(process.cwd(), 'src/modules/key-management-service')),
    },
  },
  root: resolve(process.cwd()),
});
