import { Linter } from 'eslint';

import { htmlEslintConfig } from '../rules/eslint-html';
import { javascriptEslintConfig } from '../rules/eslint-javascript';
import { typescriptEslintConfig } from '../rules/eslint-typescript';
import { cssEslintConfig } from '../rules/eslint-css';

import { tailwindJsxConfig } from '../rules/eslint-tailwind-jsx';
import { a11yEslintConfig } from '../rules/eslint-a11y';
import { reactEslintConfig } from '../rules/eslint-react';
import { tanStackQueryEslintConfig } from '../rules/eslint-tanstack';
import { vitestEslintConfig } from '../rules/eslint-tests';

import { complexityEslintConfig } from '../rules/eslint-complexity';
import { prettierEslintConfig } from '../rules/eslint-prettier';
import { importEslintConfig } from '../rules/eslint-imports';
import { checkFileEslintConfig } from '../rules/eslint-naming-conventions';

/**
 * Shared ESLint Flat Config aggregation for the OVH Manager codebase.
 *
 * This includes linting rules for:
 * - Core web languages (HTML, CSS, JS, TS)
 * - Popular tools and frameworks (React, Tailwind, Vitest, TanStack Query)
 * - Code structure, complexity, and formatting
 * - File naming and import conventions
 *
 * You may use this full config or import specific ones individually.
 *
 * @example
 * ```ts
 * import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';
 * export default eslintSharedConfig;
 * ```
 */
export const eslintSharedConfig: Linter.FlatConfig[] = [
  // Core language support
  htmlEslintConfig,
  javascriptEslintConfig,
  typescriptEslintConfig,
  cssEslintConfig,

  // Static analysis extensions
  ...importEslintConfig,          // JS/TS import rules
  tailwindJsxConfig,              // Tailwind CSS linting
  a11yEslintConfig,               // Accessibility

  // Frameworks & Libraries
  reactEslintConfig,
  tanStackQueryEslintConfig,

  // Testing and complexity constraints
  vitestEslintConfig,
  complexityEslintConfig,

  // Formatter (should go last to avoid conflict)
  prettierEslintConfig,

  // Structural constraints (e.g., file/folder naming)
  ...checkFileEslintConfig,
];
