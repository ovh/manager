import path from 'path';
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
      setupFiles: ['./src/test-utils/setup-test.ts'],
      server: {
        deps: {
          // Inline @ovh-ux packages to fix ESM resolution issues
          // (missing .js extensions in compiled output)
          inline: [/@ovhcloud\/ods-react.*/, /@ovh-ux\/.*/],
        },
      },
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
      dedupe: [
        ...defaultDedupedDependencies,
        'msw',
        '@tanstack/react-table',
        '@ovh-ux/muk',
      ],
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
