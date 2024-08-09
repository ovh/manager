import path from 'path';
import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      include: ['src'],
      exclude: [
        'src/configInterface.ts',
        'src/api',
        'src/zimbra.config.ts',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/hooks/index.ts',
        'src/hooks/types.ts',
        'src/index.tsx',
        'src/routes/routes.tsx',
        'src/utils/index.ts',
        'src/**/*constants.ts',
        ...coverageConfigDefaults.exclude,
      ],
    },
    setupFiles: ['src/utils/test.setup.tsx'],
  },
  resolve: {
    alias: {
      '@/public': path.resolve(__dirname, 'public'),
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
