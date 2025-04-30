import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.tsx',
    coverage: {
      include: ['src'],
      exclude: [
        'src/types',
        'src/__tests__',
        'src/**/*constants.ts',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/index.tsx',
        'src/tracking.constant.ts',
        'src/i18n.ts',
        'src/main.tsx',
        'src/routes.tsx',
        'src/queryClient.ts',
        'src/**/*.spec.ts',
        'src/**/*.spec.tsx',
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
      '@sms': path.resolve(__dirname, 'src/modules/sms'),
    },
    mainFields: ['module'],
  },
});
