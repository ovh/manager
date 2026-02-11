import { tailwind4 } from 'tailwind-csstree';

import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
  { ...reactEslintConfig, ignores: [...(reactEslintConfig.ignores || []), '**/__tests__/**'] },
  a11yEslintConfig,
  htmlEslintConfig,
  {
    ...tailwindJsxConfig,
    rules: {
      ...tailwindJsxConfig.rules,
      'tailwindcss/no-arbitrary-value': 'off',
    },
    ignores: [...(tailwindJsxConfig.ignores || []), '**/__tests__/**'],
  },
  tanStackQueryEslintConfig,
  vitestEslintConfig,
  prettierEslintConfig,
  {
    ...complexityJsxTsxConfig,
    ignores: [...(complexityJsxTsxConfig.ignores || []), '**/__tests__/**'],
  },
  {
    ...complexityTsJsConfig,
    ignores: [...(complexityTsJsConfig.ignores || []), '**/__tests__/**'],
  },
  {
    ...cssEslintConfig,
    files: ['**/*.css', '**/*.scss'],
    languageOptions: {
      ...cssEslintConfig.languageOptions,
      customSyntax: tailwind4,
    },
    rules: {
      ...cssEslintConfig.rules,
      'css/no-invalid-properties': 'off',
      'css/no-invalid-at-rules': 'off',
      'css/no-invalid-at-rule-placement': 'off',
    },
  },
];
