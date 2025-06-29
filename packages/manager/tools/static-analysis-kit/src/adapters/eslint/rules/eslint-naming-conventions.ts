import { Linter } from 'eslint';
import checkFile from 'eslint-plugin-check-file';

export const checkFileEslintConfig: Linter.FlatConfig[] = [
  {
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      // Disallow index.ts(x) files
      'check-file/no-index': 'error',

      // Block filenames that violate conventions
      'check-file/filename-blocklist': [
        'error',
        {
          '**/*.model.ts': '*.models.ts',
          '**/*.util.ts': '*.utils.ts',
        },
      ],

      // Folder-based rules
      'check-file/folder-match-with-fex': [
        'error',
        {
          '*.test.{js,jsx,ts,tsx}': '**/__tests__/',
          '*.styled.{jsx,tsx}': '**/components/',
        },
      ],

      // File naming conventions by type
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.component.{js,ts,jsx,tsx}': 'PASCAL_CASE',
          '**/*.page.{js,ts,jsx,tsx}': 'PASCAL_CASE',
          '**/*.hook.ts': 'CAMEL_CASE',
          '**/*.test.{ts,tsx}': 'CAMEL_CASE',
          '**/*.spec.{ts,tsx}': 'CAMEL_CASE',
          '**/*.ts': 'KEBAB_CASE', // fallback
        },
      ],

      // Folder naming by scope
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/components/*/': 'PASCAL_CASE',
          'src/!(components)/**/!(__tests__)/': 'CAMEL_CASE',
        },
      ],
    },
  },
];
