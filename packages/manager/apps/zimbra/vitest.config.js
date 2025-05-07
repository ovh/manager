import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultCoverageConfig,
} from '@ovh-ux/manager-unit-tests-config';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['src/utils/test.setup.tsx'],
      coverage: {
        exclude: [
          'src/data/api',
          'src/zimbra.config.ts',
          'src/vite-*.ts',
          'src/App.tsx',
          'src/hooks/index.ts',
          'src/index.tsx',
          'src/routes/routes.tsx',
          'src/utils/index.ts',
          'src/**/*constants.ts',
          ...defaultCoverageConfig.exclude,
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
