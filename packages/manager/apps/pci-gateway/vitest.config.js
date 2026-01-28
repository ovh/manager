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
      setupFiles: './src/setupTests.ts',
      coverage: {
        include: ['src'],
        exclude: [
          'src/interface',
          'src/__tests__',
          'src/vite-*.ts',
          'src/App.tsx',
          'src/core/ShellRoutingSync.tsx',
          'src/core/HidePreloader.tsx',
          'src/i18n.ts',
          'src/main.tsx',
          'src/routes.tsx',
          'src/constants.ts',
          'src/**/*.constants.ts',
          'src/queryClient.ts',
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
