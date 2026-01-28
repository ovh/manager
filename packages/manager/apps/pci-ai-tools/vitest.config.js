import path from 'path';

import {
  createConfig,
  mergeConfig,
  sharedConfig,
  defaultDedupedDependencies,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/__tests__/setupTest.ts'],
      coverage: {
        include: ['src'],
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
        ],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
