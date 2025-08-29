import path from 'path';

import {
  createConfig,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
} from '@ovh-ux/manager-tests-setup';

// https://vitejs.dev/config/
export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['vitest.setup.js'],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/types',
          'src/translations',
          'src/test-utils',
          'src/data/types',
          'src/data/mocks',
          'src/**/*.spec.ts',
          'src/**/*.spec.tsx',
        ],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
