import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    server: {
      deps: {
        inline: ['clsx'],
      },
    },
    deps: {
      inline: ['@ovhcloud/ods-react'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [path.resolve(__dirname, 'node_modules')],
        },
      },
    },
    globals: true,
    environment: 'jsdom',
    coverage: {
      include: ['src'],
      exclude: [
        'src/interface',
        'src/__tests__',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/core/ShellRoutingSync.tsx',
        'src/i18n.ts',
        'src/main.tsx',
        'src/routes.tsx',
      ],
    },
    setupFiles: ['./src/utils/test/setupTests.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
