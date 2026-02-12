import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';

export default [
  javascriptEslintConfig,
  vitestEslintConfig,
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    files: ['./src/kernel/utils/log-manager.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['./bin/manager-pm-validation.js', './bin/manager-pm-cds-validation.js'],
    rules: {
      'max-lines': 'off',
    },
  },
];
