/**
 * Blocklist specific filename patterns.
 * Keys are globs to match filenames; values are examples of the preferred format.
 */
export const filenameBlocklist: Record<string, string> = {
  '**/*.model.ts': '*.models.ts',
  '**/*.util.ts': '*.utils.ts',
};

/**
 * Folder placement enforcement for specific file types.
 */
export const folderMatchWithFex: Record<string, string | string[]> = {
  // Translation files must live under public/translations/<namespace>/
  'Messages_*.json': [
    // µ-apps
    'public/translations/*/',

    // manager-react-components package support
    'src/components/*/translations/',
  ],

  // Spec/test files
  '*.spec.{js,jsx,ts,tsx}': '**/*/',
  '*.test.{js,jsx,ts,tsx}': '**/__tests__/',

  // Components
  '*.component.{js,jsx,ts,tsx}': 'src/components/*/',

  // Styled components
  '*.styled.{js,jsx,ts,tsx}': 'src/components/*/',

  // Pages and subroutes
  '*.page.{js,jsx,ts,tsx}': 'src/pages/**/',
  '*.layout.{js,jsx,ts,tsx}': 'src/pages/**/',
  '*.modal.{js,jsx,ts,tsx}': 'src/pages/**/',

  // Custom hooks
  'use*.{ts,tsx}': [
    'src/hooks/*/',
    'src/data/hooks/*/',
  ],

  // Constants
  '*.constants.{ts,js}': 'src/**/',

  // Types
  '*.type.ts': ['src/types/', 'src/**/'],
  '*.interface.ts': ['src/types/', 'src/**/'],
};

/**
 * Naming conventions per file type.
 */
export const filenameNamingConvention: Record<string, 'PASCAL_CASE' | 'CAMEL_CASE' | 'KEBAB_CASE'> = {
  '**/*.component.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.styled.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.page.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.modal.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.layout.{js,ts,jsx,tsx}': 'PASCAL_CASE',

  '**/*.hook.{ts,tsx}': 'CAMEL_CASE',
  '**/*.test.{ts,tsx}': 'CAMEL_CASE',
  '**/*.spec.{ts,tsx}': 'CAMEL_CASE',

  '**/*.type.ts': 'KEBAB_CASE',
  '**/*.interface.ts': 'KEBAB_CASE',
  '**/*.constants.{ts,js}': 'KEBAB_CASE',
  '**/*.ts': 'KEBAB_CASE',
};

/**
 * Folder naming convention (everything = kebab-case)
 */
export const folderNamingConvention: Record<string, 'KEBAB_CASE'> = {
  '**/': 'KEBAB_CASE',
};
