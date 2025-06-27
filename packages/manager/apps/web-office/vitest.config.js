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
      setupFiles: ['src/utils/test.setup.tsx'],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/configInterface.ts',
          'src/api',
          'src/web-office.config.ts',
          'src/hooks/index.ts',
          'src/hooks/types.ts',
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
