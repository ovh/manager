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
      setupFiles: './src/setupTests.tsx',
      coverage: {
        include: ['src'],
        exclude: [
          'src/**/*constants.ts',
          'src/queryClient.ts',
          'src/vite-*.ts',
          'src/App.tsx',
          'src/core/ShellRoutingSync.tsx',
          'src/main.tsx',
          'src/pages/Layout.tsx',
          'src/routes.tsx',
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
