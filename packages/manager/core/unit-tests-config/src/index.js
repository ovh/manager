// Hexagonal Architecture-style boundary:
// enforcing clear isolation boundaries between the framework (Vitest) and the application domain
import {
  defineConfig as createConfig,
  mergeConfig,
  coverageConfigDefaults as defaultCoverageConfig,
} from 'vitest/config';
import react from '@vitejs/plugin-react';

export { createConfig, mergeConfig, defaultCoverageConfig };

export const sharedConfig = createConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',

    // 🧹 Avoids unwanted default — apps must override explicitly
    setupFiles: null,

    coverage: {
      include: ['src'],
      exclude: [
        ...defaultCoverageConfig.exclude,
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
