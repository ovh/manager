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
      setupFiles: ['src/utils/test.setup.tsx'],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/**/**.constant.*',
          'src/routes/*',
          'src/api',
          'src/web-hosting.config.ts',
          'src/hooks/index.ts',
          'src/hooks/types.ts',
          'src/pages/404.tsx',
          'src/pages/layout.tsx',
          'src/queryClient.ts',
          'src/utils/index.ts',
        ],
      },
    },
    mergeConfig,
    sharedConfig,
    resolve: {
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
