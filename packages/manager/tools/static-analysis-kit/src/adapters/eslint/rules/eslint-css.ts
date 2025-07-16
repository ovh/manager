import css from '@eslint/css';
import { ESLint, Linter } from 'eslint';
import { tailwind4 } from 'tailwind-csstree';

import { cssFiles } from '../../../configs/file-globs-config';

type ExtendedFlatConfig = Linter.FlatConfig & {
  language?: string;
  languageOptions?: Record<string, unknown>;
};

/**
 * ESLint configuration for validating CSS files, including Tailwind CSS syntax.
 *
 * Uses `@eslint/css` plugin with `tailwind-csstree` custom parser to support Tailwind-specific syntax.
 * Ensures clean and valid CSS, while integrating seamlessly into modern component-based workflows.
 *
 * Applies only to `.css` files.
 *
 * @see https://github.com/eslint/css?tab=readme-ov-file#rules
 * @see https://github.com/francoismassart/tailwind-csstree
 */
export const cssEslintConfig: ExtendedFlatConfig = {
  files: [cssFiles],
  language: 'css/css',
  languageOptions: {
    customSyntax: tailwind4,
  },
  plugins: {
    css: css as unknown as ESLint.Plugin,
  },
  rules: {
    ...css.configs.recommended.rules,
  },
};
