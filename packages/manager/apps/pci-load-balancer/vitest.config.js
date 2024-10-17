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
        'src/**/*constants.ts',
        'src/**/*enum.ts',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/core/ShellRoutingSync.tsx',
        'src/core/HidePreloader.tsx',
        'src/main.tsx',
        'src/pages/Layout.tsx',
        'src/routes.tsx',
        'src/queryClient.ts',
        'src/wrapperRenders.tsx',
        'src/mocks/index.ts',
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
