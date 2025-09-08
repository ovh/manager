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
      setupFiles: './src/setupTests.ts',
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/core/ShellRoutingSync.tsx',
          'src/core/HidePreloader.tsx',
          'src/pages/Layout.tsx',
          'src/queryClient.ts',
          'src/wrapperRenders.tsx',
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
