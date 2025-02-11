import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-utils/setupTest.ts',
    coverage: {
      include: ['src'],
      exclude: [
        'src/types',
        'src/test-utils',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/index.tsx',
        'src/tracking.constant.ts',
        '404.tsx',
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
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
