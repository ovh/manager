/* eslint-disable import/no-unresolved */
import { a11yEslintConfig } from './src/adapters/eslint/rules/eslint-a11y';
// import { biomeEslintConfig } from './src/adapters/eslint/rules/eslint-biome';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from './src/adapters/eslint/rules/eslint-complexity';
import { htmlEslintConfig } from './src/adapters/eslint/rules/eslint-html';
import { importEslintConfig } from './src/adapters/eslint/rules/eslint-imports';
import { javascriptEslintConfig } from './src/adapters/eslint/rules/eslint-javascript';
import { checkFileEslintConfig } from './src/adapters/eslint/rules/eslint-naming-conventions';
import { prettierEslintConfig } from './src/adapters/eslint/rules/eslint-prettier';
import { reactEslintConfig } from './src/adapters/eslint/rules/eslint-react';
import { tanStackQueryEslintConfig } from './src/adapters/eslint/rules/eslint-tanstack';
import { vitestEslintConfig } from './src/adapters/eslint/rules/eslint-tests';
import { typescriptEslintConfig } from './src/adapters/eslint/rules/eslint-typescript';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
  reactEslintConfig,
  htmlEslintConfig,
  a11yEslintConfig,
  tanStackQueryEslintConfig,
  ...importEslintConfig,
  ...checkFileEslintConfig,
  vitestEslintConfig,
  // biomeEslintConfig,
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    ignores: ['**/*.md', '**/coverage/**', '**/dist/**', '**/*.d.ts'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  {
    files: ['**/*.{ts,js,mjs}'],
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
  },
];
