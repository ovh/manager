import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/setupTests.ts',
      coverage: {
        exclude: [...defaultExcludedFiles],
      },
    },
    resolve: {
      dedupe: [...defaultDedupedDependencies],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@ovh-ux/manager-gcj-module': path.resolve(
          __dirname,
          '__mocks__/gcj-module.tsx',
        ),
      },
    },
  }),
);
