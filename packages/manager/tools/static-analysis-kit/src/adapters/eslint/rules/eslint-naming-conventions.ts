import { Linter } from 'eslint';
import checkFile from 'eslint-plugin-check-file';
import {
  filenameBlocklist,
  folderMatchWithFex,
  filenameNamingConvention,
  folderNamingConvention,
} from '../../../configs/naming-conventions-config';

/**
 * ESLint Flat Config for enforcing file and folder naming conventions.
 *
 * This configuration uses `eslint-plugin-check-file` to:
 * - Disallow `index.ts(x)` files
 * - Enforce naming convention patterns for filenames and folders
 * - Prevent common misnaming via blocklists and structural match rules
 *
 * @see https://github.com/dukeluo/eslint-plugin-check-file
 */
export const checkFileEslintConfig: Linter.FlatConfig[] = [
  {
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      /** Disallow use of index files like index.ts or index.tsx */
      'check-file/no-index': 'error',

      /** Blocklist specific filename patterns (e.g., *.model.ts should be *.models.ts) */
      'check-file/filename-blocklist': ['error', filenameBlocklist],

      /** Enforce folder structure to match file type expectations (e.g., tests inside __tests__) */
      'check-file/folder-match-with-fex': ['error', folderMatchWithFex],

      /** Enforce naming style per file type (e.g., PascalCase for components) */
      'check-file/filename-naming-convention': ['error', filenameNamingConvention],

      /** Enforce folder naming style per scope (e.g., PascalCase for /components) */
      'check-file/folder-naming-convention': ['error', folderNamingConvention],
    },
  },
];
