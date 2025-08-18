import js from '@eslint/js';
import { Linter } from 'eslint';

import { jsFilesLoose } from '../../../configs/file-globs-config';

/**
 * ESLint Flat Config for standard JavaScript files.
 *
 * Applies:
 * - ESLint's built-in recommended rules via `@eslint/js`
 * - Supports both `.js` and `.jsx` files (loose JS pattern)
 * - Configured for ECMAScript Modules (`sourceType: 'module'`)
 *
 * @see https://eslint.org/docs/latest/rules/
 */
export const javascriptEslintConfig: Linter.FlatConfig = {
  files: [jsFilesLoose],
  ignores: [],
  languageOptions: {
    ...js.languageOptions,
    sourceType: 'module',
  },
  rules: {
    ...js.configs.recommended.rules,
  },
};
