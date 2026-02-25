import path from 'path';
import {
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  INLINE_DEPS,
  mergeConfig,
  sharedConfig,
  sharedCssConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['./setupTests.ts'],
      server: {
        deps: {
          inline: INLINE_DEPS,
        },
      },
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'vite-*.ts',
          'src/__mocks__',
          'src/__datasets__',
          'src/types',
          'src/lib.ts',
          'src/data/types',
        ],
      },
      ...sharedCssConfig,
    },
    resolve: {
      dedupe: defaultDedupedDependencies,
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
