import {
  defaultDedupedDependencies,
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';
import path from 'path';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['./src/__tests__/setupTest.ts'],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
          'src/__tests__',
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
