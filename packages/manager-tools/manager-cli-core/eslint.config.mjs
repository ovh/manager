import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
  tanStackQueryEslintConfig,
  vitestEslintConfig,
  prettierEslintConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/__tests__/**/*.{js,jsx,ts,tsx}'],
    rules: {
      ...Object.fromEntries(
        Object.keys({ ...complexityJsxTsxConfig.rules, ...complexityTsJsConfig.rules }).map(
          (rule) => [rule, 'off'],
        ),
      ),
    },
  },
  {
    ignores: ['**/*.md', '**/coverage/**', '**/dist/**', '**/*.d.ts'],
  },
];
