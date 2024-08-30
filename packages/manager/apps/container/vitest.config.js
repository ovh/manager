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
        'src/**/*constants.ts',
        'src/**/*enum.ts',
        'src/vite-*.ts',
      ],
    },
    exclude: ['src/__tests__', 'node_modules', 'dist'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
