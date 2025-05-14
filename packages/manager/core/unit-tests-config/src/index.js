import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',

    // 🧹 Avoids unwanted default — apps must override explicitly
    setupFiles: null,

    coverage: {
      include: ['src'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/__tests__',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/index.tsx',
        'src/**/*constants.ts',
        'src/**/*enum.ts',
      ],
    },
  },

  // Let each app define aliases like @ or @/public
  resolve: {
    alias: {},
    mainFields: ['module'],
  },
});
