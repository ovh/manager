import path from 'path';
import { defineConfig } from 'vite';
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
        'src/__tests__',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/hooks/__tests__',
        'src/hooks/index.ts',
        'src/hooks/types.ts',
        'src/index.tsx',
        'src/routes/routes.tsx',
        'src/utils/index.ts',
        'src/**/*constants.ts',
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
