/* eslint-disable import/no-unresolved */
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';

export default [
  {
    ignores: ['**/*.md', '**/coverage/**', '**/dist/**', '**/*.json'],
  },

  // Core language support
  javascriptEslintConfig,

  // Static analysis extensions
  ...importEslintConfig, // JS/TS import rules

  // Testing and complexity constraints
  complexityJsxTsxConfig,
  complexityTsJsConfig,

  // Formatter (should go last to avoid conflict)
  prettierEslintConfig,

  // Structural constraints (e.g., file/folder naming)
  ...checkFileEslintConfig,

  {
    files: ['**/index.js'],
    // TODO: these rules override should be removed once the generator is up to date
    rules: {
      'check-file/no-index': 'off',
      'import/no-nodejs-module': 'off',
      'no-undef': 'off',
      'import/no-nodejs-modules': 'off',
      'max-lines-per-function': 'off',
    },
  },
  {
    files: ['**/.eslintrc.cjs'],
    // TODO: these rules override should be removed once the generator is up to date
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['**/create-structure-helpers.js'],
    // TODO: these rules override should be removed once the generator is up to date
    rules: {
      'import/no-nodejs-modules': 'off',
    },
  },
];
