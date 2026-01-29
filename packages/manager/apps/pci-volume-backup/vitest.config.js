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
      setupFiles: './src/setupTests.tsx',
      coverage: {
        include: ['src'],
        exclude: [
          'src/interface',
          'src/__tests__',
          'src/vite-*.ts',
          'src/App.tsx',
          'src/i18n.ts',
          'src/main.tsx',
          'src/routes.tsx',
          'src/**/*.{spec,test}.{tsx,ts}',
          'src/**/*.types.ts',
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
