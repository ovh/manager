/**
 * Blocklist specific filename patterns.
 * Keys are globs to match filenames; values are examples of the preferred format.
 * Used by `check-file/filename-blocklist`.
 */
export const filenameBlocklist: Record<string, string> = {
  '**/*.model.ts': '*.models.ts',
  '**/*.util.ts': '*.utils.ts',
};

/**
 * Enforces that certain files reside in specific folders.
 * Keys are file patterns; values are expected folder globs.
 * Used by `check-file/folder-match-with-fex`.
 */
export const folderMatchWithFex: Record<string, string> = {
  '*.test.{js,jsx,ts,tsx}': '**/__tests__/',
  '*.styled.{jsx,tsx}': '**/components/',
};

/**
 * Enforces naming conventions for different file types.
 * Keys are file globs; values are casing styles like `PASCAL_CASE`, `CAMEL_CASE`, or `KEBAB_CASE`.
 * Used by `check-file/filename-naming-convention`.
 */
export const filenameNamingConvention: Record<string, 'PASCAL_CASE' | 'CAMEL_CASE' | 'KEBAB_CASE'> = {
  '**/*.component.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.page.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.hook.ts': 'CAMEL_CASE',
  '**/*.test.{ts,tsx}': 'CAMEL_CASE',
  '**/*.spec.{ts,tsx}': 'CAMEL_CASE',
  '**/*.ts': 'KEBAB_CASE',
};

/**
 * Enforces naming conventions for specific folders.
 * Keys are folder globs; values are expected casing styles.
 * Used by `check-file/folder-naming-convention`.
 */
export const folderNamingConvention: Record<string, 'PASCAL_CASE' | 'CAMEL_CASE'> = {
  'src/components/*/': 'PASCAL_CASE',
  'src/!(components)/**/!(__tests__)/': 'CAMEL_CASE',
};
