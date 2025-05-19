import path from 'path';

import {
  sharedConfig,
  mergeConfig,
  createConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      timeout: 1000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
