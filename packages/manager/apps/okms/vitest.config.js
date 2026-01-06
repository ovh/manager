/* eslint-disable no-undef */
import path from 'path';

import {
  INLINE_DEPS,
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/setupTests.tsx',
      deps: {
        inline: ['@ovh-ux/logs-to-customer', '@ovhcloud/ods-components', ...INLINE_DEPS],
      },
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/types',
          'src/tracking.constant.ts',
          'src/queryClient.ts',
          'src/**/*.spec.ts',
          'src/**/*.spec.tsx',
        ],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@secret-manager': path.resolve(__dirname, 'src/modules/secret-manager'),
        '@key-management-service': path.resolve(__dirname, 'src/modules/key-management-service'),
      },
    },
  }),
);
