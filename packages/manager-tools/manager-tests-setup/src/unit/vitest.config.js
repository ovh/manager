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
 * Default dependency list to deduplicate in Vitest/Vite `resolve.dedupe`.
 *
 * Ensures that critical runtime libraries (React, i18next, ODS, etc.)
 * are always resolved as a single instance during testing.
 *
 * This prevents issues such as:
 *  - Multiple React copies leading to "hooks called from invalid React" errors
 *  - Duplicate i18next instances causing inconsistent translations
 *  - ODS theming components not sharing context
 *
 * ## Usage
 *
 * ### Common config
 * ```ts
 * import {
 *   createConfig,
 *   mergeConfig,
 *   sharedConfig,
 *   defaultDedupedDependencies,
 * } from '@ovh-ux/manager-tests-setup';
 *
 * export default mergeConfig(
 *   sharedConfig,
 *   createConfig({
 *     resolve: {
 *       dedupe: [...defaultDedupedDependencies],
 *     },
 *   }),
 * );
 * ```
 *
 * ### Standalone config
 * ```ts
 * import { defineConfig } from 'vitest/config';
 * import { defaultDedupedDependencies } from '@ovh-ux/manager-tests-setup';
 *
 * export default defineConfig({
 *   resolve: {
 *     dedupe: [...defaultDedupedDependencies],
 *   },
 * });
 * ```
 */
export const defaultDedupedDependencies = [
  '@ovh-ux/manager-core-api',
  '@ovh-ux/manager-react-shell-client',
  '@tanstack/react-query',
  'i18next',
  'react',
  'react-dom',
  'react-i18next',
  'react-router-dom',
  '@ovhcloud/ods-common-core',
  '@ovhcloud/ods-common-testing',
  '@ovhcloud/ods-common-theming',
  '@ovhcloud/ods-components',
  '@ovhcloud/ods-theme-blue-jeans',
  'vite',
  'vitest',
  '@vitest',
  'typescript',
  'date-fns',
  '@ovh-ux/manager-react-components',
];

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
