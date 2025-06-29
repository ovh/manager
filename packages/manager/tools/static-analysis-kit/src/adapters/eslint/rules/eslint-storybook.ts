import storybook from 'eslint-plugin-storybook';
import { Linter } from 'eslint';
import { storyFiles } from '../../../configs/file-globs-config';

const overrides: Linter.FlatConfig = {
  files: [storyFiles],
  rules: {
    'storybook/hierarchy-separator': 'error',
    // https://github.com/storybookjs/eslint-plugin-storybook
  },
};

export const storybookEslintConfig: Linter.FlatConfig[] = [
  ...(storybook.configs['flat/recommended'] as Linter.FlatConfig[]),
  overrides,
];
