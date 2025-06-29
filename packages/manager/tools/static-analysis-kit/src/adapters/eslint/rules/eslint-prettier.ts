import prettier from 'eslint-plugin-prettier';
import { Linter } from 'eslint';
import { prettierConfig, prettierIgnorePatterns } from '../../../configs/prettier-config';
import { commonTextFiles } from '../../../configs/file-globs-config';

export const prettierEslintConfig: Linter.FlatConfig = {
  files: [commonTextFiles],
  ignores: prettierIgnorePatterns,
  plugins: {
    prettier,
  },
  rules: {
    'prettier/prettier': ['error', prettierConfig, { usePrettierrc: false }],
  },
};
