import path from 'path';
import {
  INLINE_DEPS,
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['./src/test-utils/setupIntegrationTests.ts'],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/types',
          'src/test-utils',
          'src/utils/tracking.ts',
          'src/pages/not-found',
          'src/data/mocks',
          'src/tracking.constant.ts',
        ],
      },
      deps: {
        inline: INLINE_DEPS,
      },
      server: {
        deps: {
          inline: INLINE_DEPS,
        },
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
