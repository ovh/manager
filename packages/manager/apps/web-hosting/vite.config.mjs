import { resolve } from 'path';
import { defineConfig } from 'vite';

import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { getLogsToCustomerConfig } from '@ovh-ux/logs-to-customer/vite-config';

const logsToCustomerConfig = getLogsToCustomerConfig();
const baseConfig = getBaseConfig(logsToCustomerConfig);

export default defineConfig({
  ...baseConfig,
  root: resolve(process.cwd()),
});
