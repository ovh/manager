/* eslint-disable import/no-unresolved */
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
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
      'check-file/filename-naming-convention': 'off',
      'check-file/folder-naming-convention': 'off',
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'import/named': 'off',
      'no-undef': 'off',
      complexity: 'off',
      'check-file/no-index': 'off',
      '@typescript-eslint/no-unsafe-call': 'warn',
    },
  },
];
