import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { getLogsToCustomerConfig } from '@ovh-ux/logs-to-customer/vite-config';
import { resolve, join } from 'path';

const logsToCustomerConfig = getLogsToCustomerConfig();
const baseConfig = getBaseConfig(logsToCustomerConfig);

export default defineConfig({
  ...baseConfig,
  resolve: {
    ...baseConfig.resolve,
    alias: {
      '@': resolve(join(process.cwd(), 'src')),
      '@secret-manager': resolve(
        join(process.cwd(), 'src/modules/secret-manager'),
      ),
      '@key-management-service': resolve(
        join(process.cwd(), 'src/modules/key-management-service'),
      ),
    },
  },
  root: resolve(process.cwd()),
});
