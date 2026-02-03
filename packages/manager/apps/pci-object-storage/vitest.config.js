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
      setupFiles: ['./src/__tests__/setupTest.ts'],
      coverage: {
        include: ['src'],
        exclude: [
          'src/__tests__',
          'src/components/guides/guides.config.ts',
          'src/vite-*.ts',
          'src/App.tsx',
          'src/i18n.ts',
          'src/index.tsx',
          'src/routes/routes.tsx',
          'src/routes/Router.tsx',
          'src/query.client.ts',
          'src/configuration',
          'src/**/*constants.ts',
          'src/main.tsx',
          'src/types',
        ],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);


