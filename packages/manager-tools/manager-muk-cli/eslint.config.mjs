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
    files: ['./src/utils/log-manager.js'],
    rules: {
      'no-console': 'off',
      'no-undef': 'off',
    },
  },
];
