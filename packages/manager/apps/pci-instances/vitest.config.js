import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      exclude: [
        'vite-*.ts',
        'App.tsx',
        'core/ShellRoutingSync.tsx',
        'main.tsx',
        'routes.tsx',
        '__mocks__',
        'queryClient.ts',
      ],
    },
    setupFiles: ['./setup.vitest.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
  root: './src',
});
