import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      include: ['src'],
      exclude: [
        'src/interface',
        'src/__tests__',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/i18n.ts',
        'src/main.tsx',
        'src/routes.tsx',
      ],
    },
    testTimeout: 60_000,
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
