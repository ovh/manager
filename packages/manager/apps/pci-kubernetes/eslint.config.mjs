// Full adoption
import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { storybookEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/storybook';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  typescriptEslintConfig,
  prettierEslintConfig,
  tailwindJsxConfig,
  tanStackQueryEslintConfig,
  ...checkFileEslintConfig,
  ...storybookEslintConfig,
  ...importEslintConfig,
  a11yEslintConfig,
  reactEslintConfig,
  htmlEslintConfig,
  a11yEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  vitestEslintConfig,
  javascriptEslintConfig,
  {
    // ...cssEslintConfig,
    // files: ['**/*.css'],
  },
  {
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'check-file/folder-naming-convention': 'off',
      'check-file/filename-naming-convention': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react/no-multi-comp': 'off',
      'css/no-important': 'off',
      'vitest/no-identical-title': 'off',
      'vitest/expect-expect': 'off',
      'import/named': 'off',
      'import/no-cycle': 'off',
      'react/jsx-uses-react': 'off',
      'import/no-unresolved': 'off',
      'max-lines-per-function': 'off',
      'check-file/no-index': 'off',
      'check-file/folder-match-with-fex': 'off',
    },
  },
];
