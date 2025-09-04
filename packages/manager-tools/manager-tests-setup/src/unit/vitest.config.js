import react from '@vitejs/plugin-react-swc';
import {
  defineConfig as createConfig,
  coverageConfigDefaults as defaultCoverageConfig,
  mergeConfig,
} from 'vitest/config';

/**
 * Exports the Vitest `defineConfig` function as `createConfig`,
 * used to create isolated test configuration blocks.
 * @see https://vitest.dev/config/
 */
export { createConfig };

/**
 * Exports the Vitest `mergeConfig` function, used to compose
 * base and app-specific configurations.
 */
export { mergeConfig };

/**
 * Provides framework default exclusions for test coverage collection.
 * Can be extended or overridden in consuming apps.
 */
export { defaultCoverageConfig };

/**
 * Manager default excluded files.
 */
export const defaultExcludedFiles = [
  ...defaultCoverageConfig.exclude,
  'src/__tests__',
  'src/vite-*.ts',
  'src/App.tsx',
  'src/index.tsx',
  'src/**/*constants.ts',
  'src/**/*enum.ts',
  'src/interface',
  'src/i18n.ts',
  'src/main.tsx',
  'src/routes.tsx',
];

/**
 * Shared test configuration applied across all frontend apps.
 * This includes common plugins, globals, and default coverage exclusions.
 *
 * App-specific configs should merge this base via `mergeConfig(...)`.
 *
 * @type {import('vitest').UserConfigExport}
 */
export const sharedConfig = createConfig({
  plugins: [react()],
  test: {
    globals: true,

    // Avoids unwanted automatic setup in downstream apps
    setupFiles: null,

    // vitest environment config
    environment: 'jsdom',

    // max timeout override
    testTimeout: 60_000,

    // coverage options
    coverage: {
      include: ['src'],
    },
  },

  // Let each app define its own aliases like @ or @/public
  resolve: {
    alias: {},
    mainFields: ['module'],
  },
});
