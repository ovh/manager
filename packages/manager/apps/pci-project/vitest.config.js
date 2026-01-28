import path from 'path';

import {
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/setupTests.tsx',
      coverage: {
        include: ['src'],
        exclude: [
          ...defaultExcludedFiles,
          'src/**/*.type.*',
          'src/**/*constant.ts',
          'src/pages/Layout.tsx',
          'src/routes',
          'src/queryClient.ts',
          'src/wrapperRenders.tsx',
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
