import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig, 	defaultDedupedDependencies,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/test-utils/setupTests.tsx',
      coverage: {
        exclude: [...defaultExcludedFiles],
      },
    },
    resolve: { dedupe: [...defaultDedupedDependencies], 
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      mainFields: ['module'],
    },
  }),
);
