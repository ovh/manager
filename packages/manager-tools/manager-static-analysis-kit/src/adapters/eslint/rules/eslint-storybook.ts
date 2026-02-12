import { Linter } from 'eslint';
import storybook from 'eslint-plugin-storybook';

import { storyFiles } from '../../../configs/file-globs-config';

/**
 * Additional Storybook-specific rule overrides.
 *
 * Applies only to `.stories` files to enforce consistency in Storybook metadata.
 *
 * @see https://github.com/storybookjs/eslint-plugin-storybook
 */
const overrides: Linter.FlatConfig = {
  files: [storyFiles],
  rules: {
    'storybook/hierarchy-separator': 'error',
  },
};

/**
 * ESLint Flat Config for Storybook.
 *
 * Combines the official `flat/recommended` config from `eslint-plugin-storybook`
 * with additional overrides for enforcing hierarchy separator style.
 */
export const storybookEslintConfig: Linter.FlatConfig[] = [
  ...(storybook.configs['flat/recommended'] as Linter.FlatConfig[]),
  overrides,
];
