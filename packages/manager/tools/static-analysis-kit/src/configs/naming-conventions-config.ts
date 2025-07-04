/**
 * Disallowed filename patterns.
 * Used by: `check-file/filename-blocklist`
 */
export const filenameBlocklist: Record<string, string> = {
  // '**/*.model.ts': '*.models.ts',
};

/**
 * Enforces folder placement per file type.
 * Used by: `check-file/folder-match-with-fex`
 */
export const folderMatchWithFex: Record<string, string> = {
  // ─────────── TRANSLATIONS ───────────
  'public/translations/*/Messages_*.json': 'public/translations/**/',
  'src/components/**/translations/Messages_*.json': 'src/components/**/translations/',

  // ─────────── COMPONENTS ───────────
  '**/*.component.{js,jsx,ts,tsx}': 'src/components/**/',
  '**/*.styled.{js,jsx,ts,tsx}': 'src/components/**/',

  // ─────────── PAGES ───────────
  '**/*.page.{js,jsx,ts,tsx}': 'src/pages/**/',
  '**/*.layout.{js,jsx,ts,tsx}': 'src/pages/**/',
  '**/*.modal.{js,jsx,ts,tsx}': 'src/pages/**/',

  // ─────────── HOOKS ───────────
  'src/hooks/**/use*.{ts,tsx}': 'src/hooks/**/',
  'src/data/hooks/**/use*.{ts,tsx}': 'src/data/hooks/**/',

  // ─────────── CONSTANTS ───────────
  '**/*.constants.{ts,js}': 'src/**/',

  // ─────────── TESTS ───────────
  '**/*.test.{ts,tsx}': '**/__tests__/',
  '**/*.spec.{ts,tsx}': 'src/**/',

  // ─────────── TYPES & INTERFACES ───────────
  '**/*.type.ts': 'src/**/',
  '**/*.interface.ts': 'src/**/',
};

type CaseStyle =
  | 'PASCAL_CASE'
  | 'CAMEL_CASE'
  | 'KEBAB_CASE'
  | 'SCREAMING_SNAKE_CASE'
  | 'FLAT_CASE'
  | 'SNAKE_CASE';

/**
 * Enforces naming conventions for files.
 * Used by: `check-file/filename-naming-convention`
 */
export const filenameNamingConvention: Record<string, CaseStyle> = {
  // ───── COMPONENT STRUCTURE ─────
  '**/*.component.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.layout.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.modal.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.page.{js,ts,jsx,tsx}': 'PASCAL_CASE',
  '**/*.styled.{js,ts,jsx,tsx}': 'PASCAL_CASE',

  // ───── HOOKS & TESTS ─────
  '**/*.hook.{ts,tsx}': 'CAMEL_CASE',
  '**/*.test.{ts,tsx}': 'PASCAL_CASE',     // Adjusted!
  '**/*.spec.{ts,tsx}': 'PASCAL_CASE',     // Adjusted!

  // ───── TRANSLATIONS ─────
  '**/Messages_[a-z][a-z]_[A-Z][A-Z].json': 'SCREAMING_SNAKE_CASE',

  // ───── TYPES & CONSTANTS ─────
  '**/*.constants.{ts,js}': 'KEBAB_CASE',
  '**/*.type.ts': 'KEBAB_CASE',
  '**/*.interface.ts': 'KEBAB_CASE',

  // ───── CORE FILES ─────
  '**/App.tsx': 'PASCAL_CASE',
  '**/ErrorBoundary.tsx': 'PASCAL_CASE',
  '**/queryClient.ts': 'CAMEL_CASE',

  // ───── BOOTSTRAP & CONFIGS ─────
  '**/routes.{ts,tsx}': 'KEBAB_CASE',
  '**/routes.constants.ts': 'KEBAB_CASE',
  '**/main.tsx': 'KEBAB_CASE',
  '**/i18n.ts': 'KEBAB_CASE',
  '**/index.{ts,tsx,js}': 'KEBAB_CASE',
  '**/*.config.{js,ts,mjs,cjs}': 'KEBAB_CASE',
  '**/*.setup.{js,ts}': 'KEBAB_CASE',
  '**/*.env.{js,ts}': 'KEBAB_CASE',

  // ───── STYLES ─────
  '**/*.scss': 'KEBAB_CASE',
  '**/*.css': 'KEBAB_CASE',
};

/**
 * Global folder naming convention.
 * Used by: `check-file/folder-naming-convention`
 */
export const folderNamingConvention: Record<string, 'KEBAB_CASE'> = {
  '**/': 'KEBAB_CASE',
};
