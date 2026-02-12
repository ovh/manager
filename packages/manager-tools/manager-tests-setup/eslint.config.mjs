import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
  ...importEslintConfig,
  ...checkFileEslintConfig,
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    rules: {
      'check-file/no-index': 'off',
      'check-file/folder-naming-convention': 'off',
      'import/no-unresolved': 'off',
      'import/no-nodejs-modules': 'off',
    },
  },
  {
    files: ['./bin/**.js'],
    languageOptions: {
      globals: {
        global: 'readonly',
      },
      env: { node: true },
    },
  },
];
