import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setupTest.ts'],
    coverage: {
      include: ['src'],
      exclude: [
        'src/types',
        'src/__tests__',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/i18n.ts',
        'src/index.tsx',
        'src/query.client.ts',
        'src/components/ui',
        'src/components/data-table/translations',
        'src/configuration',
        'src/**/*constants.ts',
        'src/main.tsx',
        'src/routes',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
