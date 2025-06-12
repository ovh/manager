import path from 'path';
import {
  sharedConfig,
  mergeConfig,
  createConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: './src/setupTests.tsx',
      fileParallelism: false,
      maxWorkers: 1,
      pollOptions: {
        forks: { singleFork: true },
        threads: { singleThread: true },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
