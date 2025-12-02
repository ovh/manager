import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
  reactEslintConfig,
  {
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
      'react/no-multi-comp': 'off',
    },
  },
  prettierEslintConfig,
  a11yEslintConfig,
  htmlEslintConfig,
  tailwindJsxConfig,
  {
    ...tailwindJsxConfig,
    rules: {
      ...(tailwindJsxConfig.rules ?? {}),
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/migration-from-tailwind-2': 'error',
      'tailwindcss/no-arbitrary-value': 'error',
      'tailwindcss/no-custom-classname': 'error',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
    },
  },
  tanStackQueryEslintConfig,
  vitestEslintConfig,
  {
    ...vitestEslintConfig,
    rules: {
      ...(vitestEslintConfig.rules ?? {}),
      'vitest/expect-expect': [
        'error',
        {
          assertFunctionNames: ['expect*', 'assert*', 'check*'],
        },
      ],
    },
  },
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  cssEslintConfig,
  {
    rules: {
      'css/no-invalid-at-rules': 'off',
      'css/no-invalid-at-rule-placement': 'off',
      'css/no-invalid-properties': 'off',
    },
  },
  ...checkFileEslintConfig,
  {
    rules: {
      'check-file/filename-naming-convention': 'off',
      'check-file/folder-match-with-fex': 'off',
      'check-file/folder-naming-convention': 'off',
      'check-file/no-index': 'off',
    },
  },
];
