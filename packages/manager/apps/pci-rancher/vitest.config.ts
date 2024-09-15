// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom', // Required for testing DOM elements (React components)
    globals: true, // Vitest provides a set of global variables like `describe`, `it`, etc.
    setupFiles: './src/setupTests.js', // Setup file for additional configuration
    coverage: {
      reporter: ['text', 'json', 'html'], // Coverage report formats
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
    server: {
      deps: {
        inline: ['clsx'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@translation/*': path.resolve(__dirname, './'),
    },
    mainFields: ['module'],
  },
  plugins: [react()], // Enables React plugin for JSX/TSX support
});
