/**
 * Blocklist specific filename patterns.
 * Keys are globs to match filenames; values are examples of the preferred format.
 */
export const filenameBlocklist: Record<string, string> = {};

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

// filename-naming-convention.config.ts

type CaseStyle =
  | 'PASCAL_CASE'
  | 'CAMEL_CASE'
  | 'KEBAB_CASE'
  | 'SCREAMING_SNAKE_CASE'
  | 'FLAT_CASE'
  | 'SNAKE_CASE';

/**
 * Naming conventions per file type.
 * Enforced using `eslint-plugin-check-file/filename-naming-convention`.
 */
export const filenameNamingConvention: Record<string, CaseStyle> = {
  // ─────────────── COMPONENT STRUCTURE ───────────────
  '**/*.component.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.layout.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.modal.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.page.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.styled.{js,ts,jsx,tsx}': 'PASCAL_CASE',

  // ─────────────── HOOKS, TESTS, SPECS ───────────────
  '**/*.hook.{ts,tsx}': 'CAMEL_CASE',
  '**/*.test.{ts,tsx}': 'CAMEL_CASE',
  '**/*.spec.{ts,tsx}': 'CAMEL_CASE',

  // ─────────────── TRANSLATION FILES ───────────────
  '**/Messages_[a-z][a-z]_[A-Z][A-Z].json': 'SCREAMING_SNAKE_CASE',

  // ─────────────── TYPES, CONSTANTS ───────────────
  '**/*.type.ts': 'KEBAB_CASE',
  '**/*.interface.ts': 'KEBAB_CASE',
  '**/*.constants.{ts,js}': 'KEBAB_CASE',

  // ─────────────── APP-SPECIFIC FILES ───────────────
  '**/App.tsx': 'PASCAL_CASE',
  '**/ErrorBoundary.tsx': 'PASCAL_CASE',
  '**/queryClient.ts': 'CAMEL_CASE',

  // ─────────────── ROUTING, BOOTSTRAP ───────────────
  '**/routes.{ts,tsx}': 'KEBAB_CASE',
  '**/routes.constants.ts': 'KEBAB_CASE',
  '**/main.tsx': 'KEBAB_CASE',
  '**/i18n.ts': 'KEBAB_CASE',

  // ─────────────── GLOBAL ENTRY FILES ───────────────
  '**/index.{ts,tsx,js}': 'KEBAB_CASE',

  // ─────────────── STYLING FILES ───────────────
  '**/*.scss': 'KEBAB_CASE',
  '**/*.css': 'KEBAB_CASE',

  // ─────────────── CONFIGURATION FILES ───────────────
  '**/*.config.{js,ts,mjs,cjs}': 'KEBAB_CASE',
  '**/*.setup.{js,ts}': 'KEBAB_CASE',
  '**/*.env.{ts,js}': 'KEBAB_CASE',

  // ─────────────── FALLBACKS ───────────────
  '**/*.tsx': 'KEBAB_CASE',
  '**/*.ts': 'KEBAB_CASE',
};

/**
 * Folder naming convention (everything = kebab-case)
 */
export const folderNamingConvention: Record<string, 'KEBAB_CASE'> = {
  '**/': 'KEBAB_CASE',
};
