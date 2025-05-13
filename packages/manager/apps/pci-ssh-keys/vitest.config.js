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
        'src/interface',
        'src/__tests__',
        'src/__tests__',
        'src/**/*constants.ts',
        'src/vite-*.ts',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/App.tsx',
        'src/core/ShellRoutingSync.tsx',
        'src/core/ShellRoutingSync.tsx',
        'src/core/HidePreloader.tsx',
        'src/i18n.ts',
        'src/i18n.ts',
        'src/main.tsx',
        'src/main.tsx',
        'src/routes.tsx',
        'src/routes.tsx',
        'src/queryClient.ts',
        'src/pages/Layout.tsx',
        // This files will be deleted while refactoring sprint, it's the rease we exclude files
        'src/components/error-page/ErrorPage.tsx',
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
