import path from 'path';
import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/utils/test.setup.tsx'],
    coverage: {
      include: ['src'],
      exclude: [
        'src/**/**.constant.*',
        'src/routes/*',
        'src/api',
        'src/web-hosting.config.ts',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/hooks/index.ts',
        'src/hooks/types.ts',
        'src/index.tsx',
        'src/pages/404.tsx',
        'src/pages/layout.tsx',
        'src/queryClient.ts',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
  resolve: {
    alias: {
      '@/public': path.resolve(__dirname, 'public'),
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
