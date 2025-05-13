import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
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
        'src/i18n.ts',
        'src/main.tsx',
        'src/pages/Layout.tsx',
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
