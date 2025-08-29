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
      setupFiles: ['./src/test-utils/setup-test.ts'],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
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
      mainFields: ['module'],
    },
  }),
);
