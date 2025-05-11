// Hexagonal Architecture-style boundary
// Enforcing clean separation between framework and test domain

import {
  defineConfig as createConfig,
  mergeConfig,
  coverageConfigDefaults as defaultCoverageConfig,
} from 'vitest/config';

import react from '@vitejs/plugin-react';

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
 * Provides default exclusions for test coverage collection.
 * Can be extended or overridden in consuming apps.
 */
export { defaultCoverageConfig };

const isBrowserMode = process.argv.includes('--browser');
const browserName = process.env.BROWSER_ENV?.trim();

/**
 * Dynamically constructs the `test` config override depending on runtime mode.
 *
 * - In browser mode (`--browser` flag with `BROWSER_ENV=chrome|firefox|...`), it enables
 *   WebDriver-based Vitest browser testing with the selected browser.
 * - Otherwise, defaults to a standard `jsdom` environment.
 *
 * This separation allows CLI-driven selection of test execution context.
 *
 * @type {import('vitest').UserConfig['test']}
 */
export const testEnvConfig =
  isBrowserMode && browserName
    ? {
        browser: {
          enabled: true,
          provider: 'webdriverio',
          instances: [
            {
              browser: browserName,
            },
          ],
        },
      }
    : {
        environment: 'jsdom',
      };

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

  // Let each app define its own aliases like @ or @/public
  resolve: {
    alias: {},
    mainFields: ['module'],
  },
});
