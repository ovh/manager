/* eslint-disable import/no-nodejs-modules */
import path from 'path';
import { fileURLToPath } from 'url';

import {
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
  sharedCssConfig,
} from '@ovh-ux/manager-tests-setup';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
