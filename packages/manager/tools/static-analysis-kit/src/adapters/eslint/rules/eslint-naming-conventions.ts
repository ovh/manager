import { Linter } from 'eslint';
import checkFile from 'eslint-plugin-check-file';
import {
  filenameBlocklist,
  folderMatchWithFex,
  filenameNamingConvention,
  folderNamingConvention,
} from '../../../configs/naming-conventions-config';

export const checkFileEslintConfig: Linter.FlatConfig[] = [
  {
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/no-index': 'error',
      'check-file/filename-blocklist': ['error', filenameBlocklist],
      'check-file/folder-match-with-fex': ['error', folderMatchWithFex],
      'check-file/filename-naming-convention': ['error', filenameNamingConvention],
      'check-file/folder-naming-convention': ['error', folderNamingConvention],
    },
  },
];
