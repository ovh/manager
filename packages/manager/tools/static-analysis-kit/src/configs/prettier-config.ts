import { createRequire } from 'module';
import { resolve } from 'path';
import { cwd } from 'process';

import { importOrderConfig } from './import-order-config.js';

/**
 * A Node.js `require` function scoped to this ES module context.
 *
 * This allows using `require.resolve(...)` to locate CommonJS or plugin paths,
 * which is not otherwise available in native ESM scope.
 *
 * @see https://nodejs.org/api/modules.html#createrequirefilename
 */
const require = createRequire(import.meta.url);

/**
 * Absolute path to the Tailwind CSS Prettier plugin.
 *
 * This plugin ensures deterministic sorting of utility classes
 * in Tailwind-based JSX/HTML code.
 *
 * Must be passed as a string path to work with `eslint-plugin-prettier`.
 */
const tailwindPluginPath = require.resolve('prettier-plugin-tailwindcss');

/**
 * Absolute path to the Trivago import-sorting Prettier plugin.
 *
 * This plugin sorts and groups imports based on customizable rules
 * to improve consistency and reduce noise in diffs.
 */
const sortImportsPluginPath = require.resolve('@trivago/prettier-plugin-sort-imports');

/**
 * Absolute path to the Tailwind configuration file for the current working directory.
 *
 * This allows Tailwind-aware tools (e.g., class sorting, custom theme detection)
 * to resolve context-sensitive rules per app or workspace.
 */
const tailwindConfigPath = resolve(cwd(), 'tailwind.config.js');

/**
 * Glob patterns that define which files or folders should be excluded
 * from Prettier formatting.
 *
 * These paths are respected in CLI usage and in `eslint-plugin-prettier`
 * where applicable.
 *
 * @type {string[]}
 */
export const prettierIgnorePatterns = [
  '**/dist/**',
  '**/custom-elements*/**',
  '**/loader/**',
  '**/react/**',
  '**/vue/**',
  '**/apps/container/**',
  '**/apps/pci-databases-analytics/src/components/ui/**',
  '**/apps/pci-databases-analytics/src/lib/utils.ts',
];

/**
 * Shared Prettier configuration for formatting source code across
 * multiple projects and editors.
 *
 * This config is injected into `eslint-plugin-prettier` rules and also
 * usable in CLI-based workflows.
 *
 * It supports:
 * - Tailwind CSS class sorting
 * - Trivago import grouping
 * - Custom code style defaults
 *
 * Plugins must be passed as resolved file paths to be compatible with ESLint.
 *
 * @see https://prettier.io/docs/en/options.html
 * @see https://github.com/prettier/prettier-plugin-tailwindcss
 * @see https://github.com/trivago/prettier-plugin-sort-imports
 *
 * @type {import('prettier').Options}
 */
export const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  arrowParens: 'always',
  endOfLine: 'lf',

  // Plugin entry paths (must be string paths, not objects)
  plugins: [tailwindPluginPath, sortImportsPluginPath],

  // Tailwind-specific sorting behavior
  tailwindConfig: tailwindConfigPath,
  tailwindFunctions: ['clsx', 'tw'],
  tailwindAttributes: ['classList'],

  // Trivago import grouping/sorting rules
  importOrder: importOrderConfig,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
