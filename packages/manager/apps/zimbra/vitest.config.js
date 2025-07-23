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
          'src/data/api',
          'src/zimbra.config.ts',
          'src/hooks/index.ts',
          'src/routes/routes.tsx',
          'src/utils/index.ts',
        ],
      },
    },
    resolve: {
      alias: {
        '@/public': path.resolve(__dirname, 'public'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
