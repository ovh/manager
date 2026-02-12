import { Linter } from 'eslint';
import checkFile from 'eslint-plugin-check-file';

import {
  filenameBlocklist,
  filenameNamingConvention,
  folderMatchWithFex,
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

      'check-file/folder-match-with-fex': [
        'error',
        folderMatchWithFex,
        {
          errorMessage:
            'The folder of the file "{{ target }}" does not match the expected pattern "{{ pattern }}". See µ-app structure guidelines.',
        },
      ],

      'check-file/filename-naming-convention': [
        'error',
        filenameNamingConvention,
        {
          ignoreMiddleExtensions: true,
          errorMessage:
            'The filename "{{ target }}" does not match the naming convention "{{ pattern }}". Please check contribute.md.',
        },
      ],

      'check-file/folder-naming-convention': [
        'error',
        folderNamingConvention,
        {
          errorMessage:
            'Folder "{{ target }}" must follow the "{{ pattern }}" naming convention. See µ-app guidelines.',
          ignoreWords: ['__tests__', '__mocks__'],
        },
      ],
    },

    settings: {
      'check-file/ignores': ['**/__tests__/**', '**/__mocks__/**'],
    },
  },
];
