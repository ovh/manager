import path from 'path';

import {
  createConfig,
  mergeConfig,
  sharedConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      passWithNoTests: true,
      coverage: {
        include: ['src'],
        exclude: [
          'src/interface',
          'src/__tests__',
          'src/**/*constants.ts',
          'src/vite-*.ts',
          'src/App.tsx',
          'src/core/ShellRoutingSync.tsx',
          'src/core/HidePreloader.tsx',
          'src/i18n.ts',
          'src/main.tsx',
          'src/routes.tsx',
          'src/queryClient.ts',
          'src/pages/Layout.tsx',
          'src/components/error-page/ErrorPage.tsx',
        ],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
