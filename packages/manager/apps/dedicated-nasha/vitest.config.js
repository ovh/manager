/* eslint-disable no-undef */
import path from 'node:path';

import {
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
  sharedCssConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['@ovh-ux/manager-core-test-utils/src/utils/setup-test.ts'],
      ...sharedCssConfig,
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'vite-*.ts',
          'App.tsx',
          '__mocks__',
          '**/Routes.tsx',
          '**/QueryClient.ts',
          '**/*.type.ts',
          '**/404.page.tsx',
          '**/utils/tests/**',
          '**/Test.utils.tsx',
        ],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
