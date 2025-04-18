import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['setupTest.tsx'],
    coverage: {
      include: ['src'],
      exclude: [
        'src/App.tsx',
        'src/test-utils',
        'src/index.tsx',
        'src/tracking.constant.ts',
        'src/vite-hmr.ts',
        'src/**/*.spec.tsx',
        'src/**/*.spec.ts',
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
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
