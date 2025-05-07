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
      setupFiles: ['./src/__tests__/setupTest.ts'],
      coverage: {
        exclude: [
          'src/types',
          'src/__tests__',
          'src/vite-*.ts',
          'src/App.tsx',
          'src/i18n.ts',
          'src/index.tsx',
          'src/query.client.ts',
          'src/components/ui',
          'src/components/data-table/translations',
          'src/configuration',
          'src/**/*constants.ts',
          'src/main.tsx',
          'src/routes',
          ...defaultCoverageConfig.exclude,
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
