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
        'src/models',
        'src/__tests__',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/i18n.ts',
        'src/index.tsx',
        'src/routes.tsx',
        'src/Router.tsx',
        'src/query.client.ts',
        'src/components/ui',
        'src/configuration',
        'src/**/*constants.ts',
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
