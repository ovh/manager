import path from 'path';

import {
  createConfig,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['./src/setupTests.ts'],
      server: {
        deps: {
          inline: [/@ovhcloud\/ods-react\/.*/i],
        },
      },
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'vite-*.ts',
          'App.tsx',
          'core/ShellRoutingSync.tsx',
          'main.tsx',
          'routes.tsx',
          '__mocks__',
          'queryClient.ts',
        ],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
