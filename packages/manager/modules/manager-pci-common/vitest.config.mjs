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
      setupFiles: './setupTests.ts',
      coverage: {
        include: ['src'],
        exclude: [
          'src/**/*.type.ts',
          'src/**/translations/index.ts',
          'src/**/index.ts',
          'src/constants/*',
          'src/**/*constants.ts',
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
