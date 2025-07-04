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
      // Prevent use of index files (e.g., index.tsx)
      'check-file/no-index': 'error',

      // Disallow bad filename suffixes
      'check-file/filename-blocklist': ['error', filenameBlocklist],

      // Enforce folder location based on file name
      'check-file/folder-match-with-fex': [
        'error',
        folderMatchWithFex,
        {
          errorMessage:
            'The folder of the file "{{ target }}" does not match the "{{ pattern }}" pattern. See µ-app folder structure guidelines.',
        },
      ],

      // Enforce file casing (PascalCase, kebab-case, etc.)
      'check-file/filename-naming-convention': ['error', filenameNamingConvention],

      // Enforce kebab-case folders across the board
      'check-file/folder-naming-convention': ['error', folderNamingConvention],
    },
  },
];
