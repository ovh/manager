import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import { complexityJsxTsxConfig, complexityTsJsConfig, } from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
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
  reactEslintConfig,
  a11yEslintConfig,
  htmlEslintConfig,
  tailwindJsxConfig,
  tanStackQueryEslintConfig,
  vitestEslintConfig,
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    files: ['**/__tests__/**/*.{js,jsx,ts,tsx}'],
    rules: {
      ...Object.fromEntries(
        Object.keys({ ...complexityJsxTsxConfig.rules, ...complexityTsJsConfig.rules }).map(
          (rule) => [rule, 'off'],
        ),
      ),
      // set of rules disabled especially for component mocks
      'react/no-multi-comp': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
      'jsx-a11y/role-has-required-aria-props': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // we often use custom classes and even if we try to not have arbitrary something we have to
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/no-arbitrary-value': 'off',
      // if not disabled it failed for memoized component. All exported components have names so this should not be a problem.
      'react/display-name': 'off',
    },
  },
  {
    ignores: ['**/*.md', '**/coverage/**', '**/dist/**', '**/*.d.ts'],
  },
];
