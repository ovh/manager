/* eslint-disable import/no-unresolved */
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';

import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';

const testFiles = [
  '**/__tests__/**',
  '**/*spec.ts',
  '**/*spec.tsx',
  '**/test-utils/**',
];

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
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: testFiles,
    languageOptions: {
      globals: {
        global: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
      'max-params': 'off',
      'react/no-multi-comp': 'off',
    },
  },
   /* ------------------------------------------------------------------------ */
   /* Root Index File Exception                                                */
   /* ------------------------------------------------------------------------ */
  {
    files: ['src/index.ts'],
    rules: {
      'check-file/no-index': 'off',
    },
  },
];
