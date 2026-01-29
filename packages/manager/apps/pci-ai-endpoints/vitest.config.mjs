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
      setupFiles: ['./src/setupTests.ts'],
      coverage: {
        include: ['src'],
        exclude: [
          'src/App.tsx',
          'src/index.tsx',
          'src/routes',
          'src/configuration',
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
