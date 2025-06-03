import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['./setup.vitest.ts'],
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
