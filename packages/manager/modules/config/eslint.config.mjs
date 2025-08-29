/* eslint-disable import/no-unresolved */
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';

import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';

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
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'check-file/no-index': 'off',
      'check-file/filename-naming-convention': 'off',
      'import/export': 'off',
      'no-undef': 'off',
      'max-lines-per-function': 'off',
      'complexity': 'off',
      'import/no-cycle': 'off',
      'max-lines': 'off'
    },
  },
];
