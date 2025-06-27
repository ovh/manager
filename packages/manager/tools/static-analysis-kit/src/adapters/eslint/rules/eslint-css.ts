// eslint-disable-next-line import/no-extraneous-dependencies
import css from '@eslint/css';
import { ESLint, Linter } from 'eslint';
// eslint-disable-next-line import/no-extraneous-dependencies
import { tailwind4 } from 'tailwind-csstree';

type ExtendedFlatConfig = Linter.FlatConfig & {
  language?: string;
  languageOptions?: Record<string, unknown>;
};

export const cssEslintConfig: ExtendedFlatConfig = {
  files: ['**/*.css'],
  language: 'css/css',
  languageOptions: {
    customSyntax: tailwind4,
  },
  plugins: {
    css: (css as unknown) as ESLint.Plugin,
  },
  rules: {
    ...css.configs.recommended.rules,
    // https://github.com/eslint/css?tab=readme-ov-file#rules
  },
};
