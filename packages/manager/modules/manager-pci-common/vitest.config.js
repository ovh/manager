import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    coverage: {
      include: ['src'],
      exclude: [
        'src/**/*.type.ts',
        'src/**/translations/index.ts',
        'src/**/index.ts',
        'src/constants/*',
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
