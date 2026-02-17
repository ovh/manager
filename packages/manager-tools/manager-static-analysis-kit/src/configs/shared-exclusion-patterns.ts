/**
 * Base exclusion patterns shared across all static analysis tools.
 *
 * These cover build artifacts, IDE/config directories, and common
 * development tooling outputs that should not be included in
 * analysis or coverage reports.
 */
const baseExclusionPatterns = [
  // build & dependencies
  '**/node_modules/**',
  '**/dist/**',
  '**/target/**',
  '**/.next/**',

  // IDE, VCS & CI/CD
  '**/.husky/**',
  '**/.vscode/**',
  '**/.idea/**',
  '**/.gitlab/**',
  '**/.github/**',

  // configuration & build tools
  '**/.eslintrc.*',
  '**/eslint*.*',
  '**/jest*.*',
  '**/webpack*.*',
  '**/babel*.*',
  '**/tailwind*.*',
  '**/turbo.json',
  '**/tsconfig.json',
  'vite-env.d.ts',

  // assets & docs
  '**/*.svg',
  '**/**.md',
  '**/Messages_*_*.json',
];

/**
 * Test and mock file exclusion patterns.
 *
 * These match any test, spec, or mock-related files or directories,
 * which are typically excluded from analysis, duplication checks,
 * or type coverage reports.
 */
const testAndMockExclusionPatterns = [
  '**/__tests__/**',
  '**/__test__/**',
  '**/tests/**',
  '**/test*/**',
  '**/**test.*',
  '**/**Test**',
  '**/**spec*.*',
  '**/mock*/**',
  '**/mocks/**',
  '**/__mocks__/**',
  '**/_mock_/**',
  '**/**Mock**/**',
];

/**
 * Type-related file exclusion patterns.
 *
 * These target definition and helper files that are typically not
 * part of functional or runtime logic.
 */
const typeAndMetaExclusionPatterns = ['**/*.types.*', '**/*.d.ts.*'];

/**
 * Shared exclusion patterns used to exclude generated, test, or config
 * files from static analysis tools (e.g., madge, duplication checks).
 *
 * Combines:
 * - Common build/config exclusions
 * - Test/mock exclusions
 * - Type/meta files
 */
export const sharedExclusionPatterns = [
  ...baseExclusionPatterns,
  ...testAndMockExclusionPatterns,
  ...typeAndMetaExclusionPatterns,
  '**/**hmr**',
  '**/**config**',
  '**/**cucumber**',
];

/**
 * Shared lint exclusion patterns.
 *
 * These extend the base exclusions with test and mock files, ensuring
 * that linting tools (e.g., ESLint) skip irrelevant or generated files.
 */
export const sharedLintExclusionPatterns = [
  ...baseExclusionPatterns,
  ...testAndMockExclusionPatterns,
  ...typeAndMetaExclusionPatterns,
  '**/**hmr**',
  '**/**config**',
  '**/**cucumber**',
];

/**
 * Exclusion patterns for TypeScript coverage analysis (`typescript-coverage-report`).
 *
 * Focused on excluding:
 * - Build outputs and dependencies
 * - Tooling/config files
 * - Tests and mocks
 * - Assets and docs
 *
 * The goal is to measure coverage on actual source code only.
 */
export const sharedTypesExclusionPatterns = [
  ...baseExclusionPatterns,
  ...testAndMockExclusionPatterns,
  '**/**config**',
  '**/**cucumber**',
];

/**
 * Glob patterns that define which files or folders should be excluded
 * from Prettier formatting.
 *
 * These paths are respected in CLI usage and in `eslint-plugin-prettier`
 * where applicable.
 *
 * @type {string[]}
 */
export const sharedCodeFormatterIgnorePatterns = [
  '**/dist/**',
  '**/custom-elements*/**',
  '**/loader/**',
  '**/react/**',
  '**/vue/**',
  '**/apps/container/**',
  '**/apps/pci-databases-analytics/src/components/ui/**',
  '**/apps/pci-databases-analytics/src/lib/utils.ts',
  '**/**.json',
  '**/README.md',
  'CHANGELOG.md',
];
