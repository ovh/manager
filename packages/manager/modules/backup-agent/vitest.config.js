import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

import { defaultDedupedDependencies } from '@ovh-ux/manager-tests-setup';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: [
      '@ovh-ux/manager-core-test-utils/src/utils/setup-test.ts',
      './src/test-utils/setupTest.ts',
      './src/test-utils/globalMocks.ts',
    ],
    globals: true,
    environment: 'jsdom',
    coverage: {
      include: ['src'],
      exclude: [],
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
    dedupe: [...defaultDedupedDependencies],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
