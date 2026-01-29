import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  {
    ...javascriptEslintConfig,
    rules: {
      ...javascriptEslintConfig.rules,
    },
  },
  {
    ...typescriptEslintConfig,
    rules: {
      ...typescriptEslintConfig.rules,
      '@typescript-eslint/no-floating-promises': 'warn',
    },
  },
  {
    ...reactEslintConfig,
    rules: {
      ...reactEslintConfig.rules,
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/use-memo': 'warn',
      'react/no-multi-comp': 'warn',
    },
  },
  a11yEslintConfig,
  htmlEslintConfig,
  tailwindJsxConfig,
  {
    ...tanStackQueryEslintConfig,
    rules: {
      ...tanStackQueryEslintConfig.rules,
      '@tanstack/query/exhaustive-deps': 'warn',
    },
  },
  {
    ...vitestEslintConfig,
    rules: {
      ...vitestEslintConfig.rules,
      'vitest/expect-expect': 'warn',
      'react/no-multi-comp': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
    },
  },
  {
    ...prettierEslintConfig,
    rules: {
      ...prettierEslintConfig.rules,
      'prettier/prettier': 'warn',
    },
  },
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    files: ['**/__tests__/**/*.{js,jsx,ts,tsx}'],
    rules: {
      ...Object.fromEntries(
        Object.keys({
          ...complexityJsxTsxConfig.rules,
          ...complexityTsJsConfig.rules,
        }).map((rule) => [rule, 'off']),
      ),
      'react/no-multi-comp': 'off',
    },
  },
  {
    ignores: ['**/*.md', '**/coverage/**', '**/dist/**', '**/*.d.ts'],
  },
];
