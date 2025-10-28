/**
 * Shared glob/regex patterns used to exclude generated, test, or config files
 * from static analysis (e.g., madge, duplication checks).
 */
export const sharedExclusionPatterns = [
  '**/node_modules/**',
  '**/target/**',
  '**/dist/**',
  '**/coverage/**',
  '**/.next/**',
  '**/next*/**',
  '**/.husky/**',
  '**/.vscode/**',
  '**/.idea/**',
  '**/.gitlab/**',
  '**/.github/**',
  '**/.eslintrc.*',
  '**/eslint*.*',
  '**/jest*.*',
  '**/webpack*.*',
  '**/babel*.*',
  '**/tailwind*.*',
  '**/tsconfig.json',
  '**/turbo.json',
  '**/__tests__/**',
  '**/__test__/**',
  '**/tests/**',
  '**/test*/**',
  '**/**test.*',
  '**/**Test**',
  '**/**spec*.*',
  '**/mock*/**',
  '**/mocks/**',
  '**/_mock_/**',
  '**/**Mock**/**',
  '**/*.types.*',
  '**/*.d.ts.*',
  '**/*.svg',
  '**/**hmr**',
  '**/**config**',
  '**/**cucumber**',
  '**/Messages_*_*.json',
  '**/**.md',
];

/**
 * Glob exclusion patterns used for TypeScript coverage analysis.
 *
 * These patterns tell `typescript-coverage-report` which files and folders
 * should be ignored when calculating type coverage. They primarily exclude:
 *
 * - **Build outputs and dependencies**: compiled or generated code (`dist`, `target`, `.next`),
 *   package manager installs (`node_modules`), and temporary work directories.
 *
 * - **Tooling and configuration files**: IDE settings (`.vscode`, `.idea`),
 *   CI/CD configs (`.github`, `.gitlab`), build/test configs (`webpack*`, `babel*`, `tailwind*`),
 *   and project metadata (`tsconfig.json`, `turbo.json`).
 *
 * - **Tests and mocks**: test sources and fixtures (`__tests__`, `*.spec.ts`,
 *   `mocks/**`, files named `*Test*`, etc.), which typically contain
 *   `any`/`unknown` values or relaxed typings not relevant for production coverage.
 *
 * - **Assets and documentation**: non-TypeScript resources such as `.svg` images,
 *   Markdown docs, and JSON translations (`Messages_*_*.json`).
 *
 * The goal is to focus type coverage metrics on **actual application source code**
 * and avoid skewing results with generated, non-critical, or test-only files.
 */
export const sharedTypesExclusionPatterns = [
  // build & dependencies
  '**/node_modules/**',
  '**/dist/**',
  '**/target/**',
  '**/.next/**',

  // tools & config
  '**/.husky/**',
  '**/.vscode/**',
  '**/.idea/**',
  '**/.gitlab/**',
  '**/.github/**',
  '**/webpack*.*',
  '**/babel*.*',
  '**/tailwind*.*',
  '**/turbo.json',
  '**/tsconfig.json',
  'vite-env.d.ts',

  // assets/docs
  '**/*.svg',
  '**/**.md',
  '**/Messages_*_*.json',
];
