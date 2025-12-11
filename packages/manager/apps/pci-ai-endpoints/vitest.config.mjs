import { defaultDedupedDependencies } from '@ovh-ux/manager-tests-setup';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      include: ['src'],
      exclude: [
        'src/App.tsx',
        'src/index.tsx',
        'src/routes',
        'src/configuration',
        'src/index.tsx',
      ],
    },
  },
  resolve: {
    dedupe: [...defaultDedupedDependencies],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
