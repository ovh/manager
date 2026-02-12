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

    // timeout config
    testTimeout: 60_000,
    hookTimeout: 60_000,
    teardownTimeout: 60_000,

    // main stability knobs
    retry: 10,
    fileParallelism: false,

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

// Shared test configuration applied across all frontend apps for launching test in muk
export const sharedCssConfig = {
  deps: {
    inline: ['@ovhcloud/ods-react'],
  },
  css: true,
};

/**
 * Dependencies that must be **inlined by Vite/Vitest**
 * instead of being externalized.
 *
 * Required for:
 * - Correct ESM/CJS interop
 * - Single React instance guarantees
 * - Testing-library compatibility
 * - Avoiding Vitest v3 SSR + JSDOM issues
 *
 * ⚠️ With Vitest v3, this list **must be defined twice**:
 * - `test.deps.inline`
 * - `test.server.deps.inline`
 *
 * The patterns intentionally cover:
 * - React core and routers
 * - Testing utilities
 * - i18n stack
 * - OVH design system packages
 * - Muk and Manager shell dependencies
 *
 * @type {(string|RegExp)[]}
 */
export const INLINE_DEPS = [
  /^react$/,
  /^react-dom$/,
  /^react-router$/,
  /^react-router-dom$/,
  /@testing-library[\\/]/,
  /react-i18next[\\/]/,
  /i18next[\\/]/,
  /@ovhcloud[\\/]ods-/,
  /@ovh-ux[\\/]muk/,
  /@ovh-ux[\\/]manager-react-shell-client[\\/]/,
];

/**
 * Dependencies that must **never be externalized** during SSR execution.
 *
 * Externalizing these packages may lead to:
 * - Multiple runtime instances
 * - Broken hooks or providers
 * - Context isolation across React trees
 *
 * This list complements `INLINE_DEPS` but is scoped
 * specifically to SSR semantics.
 *
 * @type {(string|RegExp)[]}
 */
export const NO_EXTERNAL_DEPS = [
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  /@testing-library/,
  /react-i18next/,
  /i18next/,
  /@ovhcloud[\\/]ods-/,
  /@ovh-ux[\\/]muk/,
];

/**
 * Creates a Vite/Vitest plugin that **stubs style imports** during tests.
 *
 * This prevents runtime errors when importing non-JS assets such as:
 * - CSS
 * - SCSS / SASS
 * - LESS
 *
 * The plugin intercepts style imports and replaces them with
 * empty virtual modules.
 *
 * ### Why this exists
 * - Avoids requiring CSS preprocessors in test environments
 * - Prevents JSDOM failures on style imports
 * - Keeps test bundles deterministic and lightweight
 *
 * ### Behavior
 * - Matches common stylesheet extensions
 * - Rewrites them to virtual modules
 * - Returns an empty module as content
 *
 * ### Scope
 * This plugin is **safe to enable globally** in shared Vitest config.
 *
 * @returns {import('vite').Plugin}
 *   A Vite-compatible plugin that stubs style imports
 */
export function stubStylesPlugin() {
  const styleRE = /\.(css|less|sass|scss)(\?.*)?$/;

  return {
    name: 'vitest-stub-styles',
    enforce: 'pre',
    resolveId(id) {
      if (styleRE.test(id)) return `\0virtual:style:${id}`;
      return null;
    },
    load(id) {
      if (id.startsWith('\0virtual:style:')) return '';
      return null;
    },
  };
}
