import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { Linter } from 'eslint';

export const typescriptEslintConfig: Linter.FlatConfig = {
  files: ['**/*.ts', '**/*.tsx'],
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
    // https://typescript-eslint.io/rules/
  },
};
