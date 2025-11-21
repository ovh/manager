import path from 'path';

import {
  createConfig,
	defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      globals: true,
      setupFiles: ['@ovh-ux/manager-core-test-utils/src/utils/setup-test.ts', './src/utils/tests/setupTest.ts'],
      css: false,
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
          '**/Test.utils.tsx',
        ],
      },
    },
    resolve: { dedupe: [...defaultDedupedDependencies, 'react-hook-form'],
      alias: {
        // eslint-disable-next-line no-undef
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
