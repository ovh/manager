// Hexagonal Architecture-style boundary
// Enforcing clean separation between framework and test domain
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
  beforeAll,
  vi,
} from 'vitest';

import {
  defineConfig as createConfig,
  mergeConfig,
  coverageConfigDefaults as defaultCoverageConfig,
} from 'vitest/config';

import react from '@vitejs/plugin-react';

export {
  // vi is intentionally exposed to ensure devs don’t feel boxed in
  // keep this for flexibility and dev experience, so it'll be easy to find documentation and community support
  vi,
  // Common test functions
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
  beforeAll,
  // Config helpers
  createConfig,
  mergeConfig,
  defaultCoverageConfig,
};

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
