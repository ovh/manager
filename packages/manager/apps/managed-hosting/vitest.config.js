/* eslint-disable no-undef */
import path from 'node:path';

import {
  INLINE_DEPS,
  NO_EXTERNAL_DEPS,
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
  stubStylesPlugin,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [...(sharedConfig.plugins ?? []), stubStylesPlugin()],
    test: {
      setupFiles: ['src/utils/tests/test.setup.tsx'],
      deps: {
        inline: INLINE_DEPS,
      },
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
          'App.tsx',
          '__mocks__',
          '**/Routes.tsx',
          '**/QueryClient.ts',
          '**/*.type.ts',
          '**/404.page.tsx',
          '**/utils/tests/**',
        ],
      },
    },
     ssr: {
          noExternal: NO_EXTERNAL_DEPS,
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
