import react from '@vitejs/plugin-react';
import path from 'node:path';

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
      setupFiles: [
        '@ovh-ux/manager-core-test-utils/src/utils/setup-test.ts',
        './src/test-utils/setupTest.ts',
        './src/test-utils/globalMocks.ts',
      ],
      coverage: {
        include: ['src'],
        exclude: [],
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
