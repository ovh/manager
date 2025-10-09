import path from 'path';
import {
  createConfig,
  mergeConfig,
  defaultExcludedFiles,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(createConfig(), {
  test: {
    setupFiles: 'setupTest.tsx',
    globals: true,
    environment: 'jsdom',
    coverage: {
      include: ['src'],
      exclude: [...defaultExcludedFiles],
    },
    server: {
      deps: {
        inline: [/@ovhcloud\/ods-react.*/],
      },
    },
    testTimeout: 60000,
    fileParallelism: false,
    maxWorkers: 1,
    pollOptions: {
      forks: {
        singleFork: true,
      },
      threads: {
        singleThread: true,
      },
    },
  },
  resolve: {
    alias: {
      '@/setupTest': path.resolve(__dirname, 'setupTest.tsx'),
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
