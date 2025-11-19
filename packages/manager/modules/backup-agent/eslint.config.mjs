/* eslint-disable import/no-unresolved */
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
  reactEslintConfig,
  ...importEslintConfig,
  ...checkFileEslintConfig,
  vitestEslintConfig,
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'no-undef': 'off',
      'check-file/no-index': 'off',
      'check-file/folder-match-with-fex': 'off',
      'check-file/filename-naming-convention': 'off',
      'check-file/folder-naming-convention': 'off',
      'max-lines-per-function': 'off',
      'import/no-cycle': 'off',
      'import/named': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/prop-types': 'off',
      'react/no-multi-comp': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'vitest/no-identical-title': 'off',
      'no-empty-pattern': 'off',
    },
  },
];
