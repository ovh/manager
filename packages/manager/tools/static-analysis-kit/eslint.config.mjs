import { javascriptEslintConfig } from './src/adapters/eslint/rules/eslint-javascript'
import { typescriptEslintConfig } from './src/adapters/eslint/rules/eslint-typescript';
import { reactEslintConfig } from './src/adapters/eslint/rules/eslint-react';
import { tanStackQueryEslintConfig } from './src/adapters/eslint/rules/eslint-tanstack';
import { importEslintConfig } from './src/adapters/eslint/rules/eslint-imports';
import { checkFileEslintConfig } from './src/adapters/eslint/rules/eslint-naming-conventions';
import { vitestEslintConfig } from './src/adapters/eslint/rules/eslint-tests';
import { prettierEslintConfig } from './src/adapters/eslint/rules/eslint-prettier';
import { complexityJsxTsxConfig, complexityTsJsConfig } from './src/adapters/eslint/rules/eslint-complexity';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
  reactEslintConfig,
  tanStackQueryEslintConfig,
  ...importEslintConfig,
  ...checkFileEslintConfig,
  vitestEslintConfig,
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    ignores: [
      '**/*.md',
      '**/coverage/**',
      '**/dist/**',
      '**/*.d.ts',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  {
    files: ['**/prettier-config.ts', '**/*.config.{ts,js,mjs}'],
    rules: {
      'import/no-nodejs-modules': 'off',
    },
  },
  {
    files: [
      '**/ts-config/config/standard/tsconfig.test.ts',
      '**/ts-config/config/strict/tsconfig.test.ts',
    ],
    rules: {
      'check-file/folder-match-with-fex': 'off',
      'check-file/filename-naming-convention': 'off',
    },
  }
];
