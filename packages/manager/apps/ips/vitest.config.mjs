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
      setupFiles: ['setupTest.tsx'],
      coverage: {
        include: ['src'],
        exclude: [
          'src/App.tsx',
          'src/test-utils',
          'src/index.tsx',
          'src/tracking.constant.ts',
          'src/vite-hmr.ts',
          'src/**/*.spec.tsx',
          'src/**/*.spec.ts',
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
