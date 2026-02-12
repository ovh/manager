import htmlPlugin from '@html-eslint/eslint-plugin';
import htmlParser from '@html-eslint/parser';
import { ESLint, Linter } from 'eslint';

import { htmlFiles } from '../../../configs/file-globs-config';

/**
 * ESLint Flat Config for linting HTML files using `@html-eslint`.
 *
 * This configuration applies HTML-specific best practices and ensures
 * semantic correctness, accessibility, and proper formatting of HTML documents.
 *
 * It uses the custom parser `@html-eslint/parser` to interpret HTML syntax
 * and the recommended rule set from `@html-eslint/eslint-plugin`.
 *
 * Applies only to `.html` files.
 *
 * @see https://html-eslint.org/docs/rules
 */
export const htmlEslintConfig: Linter.FlatConfig = {
  files: [htmlFiles],
  ignores: [],
  plugins: {
    '@html-eslint': htmlPlugin as unknown as ESLint.Plugin,
  },
  languageOptions: {
    parser: htmlParser,
  },
  rules: {
    ...htmlPlugin.configs['flat/recommended'].rules,
  },
};
