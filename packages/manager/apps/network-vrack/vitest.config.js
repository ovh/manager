/* eslint-disable no-undef */
import path from 'node:path';

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
      setupFiles: ['./src/__tests__/SetupTests.ts'],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'vite-*.ts',
          'App.tsx',
          '__mocks__',
          '**/__tests__/**',
          '**/Routes.tsx',
          '**/QueryClient.ts',
          '**/*.type.ts',
          '**/Error404.page.tsx',
          '**/Test.utils.tsx',
        ],
      },
      deps: {
        inline: [...INLINE_DEPS, ...sharedCssConfig.deps.inline],
      },
      server: {
        deps: {
          inline: [...INLINE_DEPS, ...sharedCssConfig.deps.inline],
        },
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
