import path from 'node:path';

import {
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
} from '@ovh-ux/manager-tests-setup';

// https://vitejs.dev/config/
export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['@ovh-ux/manager-core-test-utils/src/utils/setup-test.ts'],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // module-specific exclusions (not in shared config):
          'src/types',
          'src/translations',
          'src/test-utils',
          'src/index.ts',
          'src/data/types',
          'src/data/mocks',
          'src/**/*.spec.ts',
          'src/**/*.spec.tsx',
        ],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
