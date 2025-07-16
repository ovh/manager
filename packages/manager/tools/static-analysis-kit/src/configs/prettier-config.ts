import { dirname, resolve } from 'path';
import { cwd } from 'process';
import { fileURLToPath } from 'url';

import { importOrderConfig } from './import-order-config';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Dynamically resolve the Tailwind config from the current working directory.
 * This allows Prettier plugins to align with the context of each app or package.
 */
const tailwindConfigPath = resolve(cwd(), 'tailwind.config.js');

/**
 * Absolute path to the Prettier plugin for sorting Tailwind CSS classes.
 */
const tailwindPrettierPluginPath = resolve(
  __dirname,
  '../../node_modules/prettier-plugin-tailwindcss/dist/index.mjs',
);

/**
 * Absolute path to the Prettier plugin for sorting imports using Trivago's strategy.
 */
const trivagoImportSortPluginPath = resolve(
  __dirname,
  '../../node_modules/@trivago/prettier-plugin-sort-imports/lib/src/index.js',
);

/**
 * Glob patterns for files and folders to exclude from Prettier formatting.
 * Applied to both Prettier CLI and editor integrations.
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
 * Shared Prettier configuration used by both CLI and eslint-plugin-prettier.
 *
 * @see https://prettier.io/docs/en/options.html
 * @see https://github.com/prettier/prettier-plugin-tailwindcss
 * @see https://github.com/trivago/prettier-plugin-sort-imports
 */
export const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  arrowParens: 'always',
  endOfLine: 'lf',

  /**
   * Prettier plugins must use absolute paths when executed via ESLint integration.
   */
  plugins: [tailwindPrettierPluginPath, trivagoImportSortPluginPath],

  /**
   * Tailwind-related options to sort classnames and recognize utility calls.
   */
  tailwindConfig: tailwindConfigPath,
  tailwindFunctions: ['clsx', 'tw'],
  tailwindAttributes: ['classList'],

  /**
   * Custom import sorting rules (used by trivago plugin).
   * These control grouping and order of import blocks.
   */
  importOrder: importOrderConfig,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
