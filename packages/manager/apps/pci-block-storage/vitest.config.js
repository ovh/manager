import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
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
        'src/App.tsx',
        'src/core/ShellRoutingSync.tsx',
        'src/core/HidePreloader.tsx',
        'src/i18n.ts',
        'src/main.tsx',
        'src/routes.tsx',
        'src/queryClient.ts',
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
