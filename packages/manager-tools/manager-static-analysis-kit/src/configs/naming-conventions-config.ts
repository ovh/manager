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

  // ─────────── COMPONENTS (allowed in components/ or pages/) ───────────
  'src/components/**/*.component.{js,jsx,ts,tsx}': 'src/components/**/',
  'src/pages/**/*.component.{js,jsx,ts,tsx}': 'src/pages/**/',

  // ─────────── PAGES ───────────
  '**/*.page.{js,jsx,ts,tsx}': 'src/pages/**/',
  '**/*.layout.{js,jsx,ts,tsx}': 'src/pages/**/',
  '**/*.modal.{js,jsx,ts,tsx}': 'src/pages/**/',

  // ─────────── HOOKS ───────────
  'src/hooks/**/use*.{ts}': 'src/hooks/**/',
  'src/data/hooks/**/use*.{ts}': 'src/data/hooks/**/',

  // ─────────── TESTS ───────────
  '**/*.test.{ts,tsx}': '**/__tests__/',
  '**/*.spec.{ts,tsx}': '**/__tests__/',
  '**/*.w3c.spec.{ts,tsx}': '**/__tests__/',
  '**/*.a11y.spec.{ts,tsx}': '**/__tests__/',

  // ─────────── CONSTANTS ───────────
  '**/*.constants.{ts,js}': 'src/**/',

  // ─────────── TYPES & INTERFACES ───────────
  '**/*.type.ts': 'src/**/',
  '**/*.interface.ts': 'src/**/',

  // ─────────── ROUTES ───────────
  'src/routes/routes.{ts,tsx}': 'src/routes/**',
  '**/routes.constants.ts': 'src/routes/**',

  // ─────────── ASSETS ───────────
  'public/assets/**/*.{png,jpg,jpeg,json,svg,webp,gif}': 'public/assets/**/',
};

/**
 * Naming conventions by file type.
 */
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
  '**/*.component.{ts,tsx}': 'PASCAL_CASE',
  '**/*.layout.{ts,tsx}': 'PASCAL_CASE',
  '**/*.modal.{ts,tsx}': 'PASCAL_CASE',
  '**/*.page.{ts,tsx}': 'PASCAL_CASE',

  // ───── CORE FILES ─────
  '**/App.tsx': 'PASCAL_CASE',
  '**/ErrorBoundary.tsx': 'PASCAL_CASE',
  '**/queryClient.ts': 'CAMEL_CASE',

  // ───── GENERAL TESTS ─────
  '**/*.test.{ts,tsx}': 'PASCAL_CASE',
  '**/*.spec.{ts,tsx}': 'PASCAL_CASE',

  // ───── HOOKS ─────
  'src/hooks/**/use*.{ts}': 'PASCAL_CASE',
  'src/data/hooks/**/use*.{ts}': 'PASCAL_CASE',

  // ───── HOOKS TESTS ─────
  'src/hooks/**/use*.spec.{ts,tsx}': 'PASCAL_CASE',
  'src/hooks/**/use*.test.{ts,tsx}': 'PASCAL_CASE',
  'src/data/hooks/**/use*.spec.{ts,tsx}': 'PASCAL_CASE',
  'src/data/hooks/**/use*.test.{ts,tsx}': 'PASCAL_CASE',

  // ───── STYLES ─────
  '**/*.scss': 'KEBAB_CASE',
  '**/*.css': 'KEBAB_CASE',

  // ───── TRANSLATIONS ─────
  '**/Messages_[a-z][a-z]_[A-Z][A-Z].json': 'SCREAMING_SNAKE_CASE',

  // ───── TYPES & CONSTANTS ─────
  '**/*.constants.{ts,js}': 'PASCAL_CASE',
  '**/*.type.ts': 'PASCAL_CASE',
  '**/*.interface.ts': 'PASCAL_CASE',

  // ───── BOOTSTRAP & CONFIGS ─────
  '**/routes.{ts,tsx}': 'KEBAB_CASE',
  '**/routes.constants.ts': 'KEBAB_CASE',
  '**/main.tsx': 'KEBAB_CASE',
  '**/i18n.ts': 'KEBAB_CASE',
  '**/index.{ts,tsx,js}': 'KEBAB_CASE',
  '**/*.config.{js,ts,mjs,cjs}': 'KEBAB_CASE',
  '**/*.setup.{js,ts}': 'KEBAB_CASE',
  '**/*.env.{js,ts}': 'KEBAB_CASE',

  // ───── PROPS ─────
  '**/*.props.{ts,tsx}': 'PASCAL_CASE',

  // ───── STORIES ─────
  '**/*.stories.{ts,tsx}': 'PASCAL_CASE',

  // ───── UTILS ─────
  '**/*.utils.{ts,tsx}': 'PASCAL_CASE',

  // ───── HELPERS ─────
  '**/*.helper.ts': 'PASCAL_CASE',

  // ───── PROVIDERS ─────
  '**/*.provider.tsx': 'PASCAL_CASE',

  // ───── API CLIENTS ─────
  '**/*.api.ts': 'PASCAL_CASE',
};

/**
 * Global folder naming convention.
 * Used by: `check-file/folder-naming-convention`
 */
export const folderNamingConvention: Record<string, 'KEBAB_CASE'> = {
  '**/': 'KEBAB_CASE',
};
