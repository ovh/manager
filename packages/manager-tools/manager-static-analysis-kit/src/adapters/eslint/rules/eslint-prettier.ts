import type { Linter } from 'eslint';
import prettier from 'eslint-plugin-prettier';

import { prettierConfig } from '../../../configs/code-formatter-config';
import { commonTextFiles } from '../../../configs/file-globs-config';
import { sharedCodeFormatterIgnorePatterns } from '../../../configs/shared-exclusion-patterns';

/**
 * ESLint Flat Config for Prettier integration.
 *
 * This configuration applies Prettier formatting rules via `eslint-plugin-prettier`
 * and ensures formatting violations are reported as ESLint errors.
 *
 * - Uses custom Prettier options from `prettierConfig`
 * - Ignores defined file patterns (e.g., build output, loaders, etc.)
 * - Applies to common text-based files such as JS/TS, JSON, YAML, Markdown
 *
 * @see https://github.com/prettier/eslint-plugin-prettier
 */
export const prettierEslintConfig: Linter.FlatConfig = {
  files: [commonTextFiles],
  ignores: sharedCodeFormatterIgnorePatterns,
  plugins: {
    prettier,
  },
  rules: {
    /** Ensures Prettier formatting is enforced via ESLint */
    'prettier/prettier': ['error', prettierConfig, { usePrettierrc: false }],
  },
};
