// import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-utils/setup-test.ts',
    coverage: {
      include: ['src'],
      exclude: [
        'src/types',
        'src/translations',
        'src/test-utils',
        'src/index.ts',
        'src/data/types',
        'src/data/mocks',
        'src/**/*.spec.ts',
        'src/**/*.spec.tsx',
      ],
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
    // alias: {
    //   '@': path.resolve(__dirname, 'src'),
    // },
    mainFields: ['module'],
  },
});
