import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { Linter } from 'eslint';

import { tsFiles } from '../../../configs/file-globs-config';

/**
 * ESLint Flat Config for TypeScript source files.
 *
 * This configuration enables type-aware linting using the `@typescript-eslint` plugin.
 * It loads `recommended-type-checked` rules and uses the project's `tsconfig.json`
 * for type resolution, allowing deeper semantic analysis.
 *
 * @see https://typescript-eslint.io/rules/
 */
export const typescriptEslintConfig: Linter.FlatConfig = {
  files: [tsFiles],
  ignores: [],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
  },
  rules: {
    ...tsPlugin.configs['recommended-type-checked'].rules,
    // Add custom or stricter rules below if needed
  },
};
