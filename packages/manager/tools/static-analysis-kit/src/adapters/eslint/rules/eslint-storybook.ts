import storybook from 'eslint-plugin-storybook';
import { Linter } from 'eslint';

const overrides: Linter.FlatConfig = {
  files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
  rules: {
    'storybook/hierarchy-separator': 'error',
    // https://github.com/storybookjs/eslint-plugin-storybook
  },
};

export const storybookEslintConfig: Linter.FlatConfig[] = [
  ...(storybook.configs['flat/recommended'] as Linter.FlatConfig[]),
  overrides,
];
