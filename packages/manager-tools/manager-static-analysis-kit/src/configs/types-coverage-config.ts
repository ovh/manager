/**
 * Default configuration for TypeScript coverage checks.
 *
 * Each property maps directly to a CLI option of `typescript-coverage-report`.
 * See: https://github.com/alexcanessa/typescript-coverage-report
 */
export const typesCoverageConfig = {
  /** Minimum percentage of coverage required (same as `--at-least`) */
  atLeast: 99,

  /** Exact percentage of coverage required (same as `--is`) */
  is: 99,

  /** Enable caching of results (same as `--cache`) */
  cache: true,

  /** Show debug information (same as `--debug`) */
  debug: true,

  /** Show detailed output (same as `--detail`) */
  detail: true,

  /** Ignore catch blocks (same as `--ignore-catch`) */
  ignoreCatch: true,

  /** Glob patterns for files to ignore (same as `--ignore-files`) */
  ignoreFiles: ['demo1/*.ts', 'demo2/foo.ts'],

  /** Path to tsconfig file (same as `--project` or `-p`) */
  project: 'tsconfig.json',

  /** Enable strict mode (same as `--strict`) */
  strict: true,

  /** Suppress error output (same as `--suppressError`) */
  suppressError: true,

  /** Update configuration with new coverage values (same as `--update`) */
  update: true,

  /** Update only if higher coverage is achieved (same as `--update-if-higher`) */
  updateIfHigher: true,

  /** Ignore unread variables with implicit any (same as `--ignore-unread`) */
  ignoreUnread: true,

  /** Ignore nested functions or classes (same as `--ignore-nested`) */
  ignoreNested: true,

  /** Ignore `as` assertions (same as `--ignore-as-assertion`) */
  ignoreAsAssertion: true,

  /** Ignore type assertions (same as `--ignore-type-assertion`) */
  ignoreTypeAssertion: true,

  /** Ignore non-null assertions (same as `--ignore-non-null-assertion`) */
  ignoreNonNullAssertion: true,

  /** Ignore object types (same as `--ignore-object`) */
  ignoreObject: true,

  /** Ignore empty type annotations (same as `--ignore-empty-type`) */
  ignoreEmptyType: true,

  /** Show relative file paths in output (same as `--show-relative-path`) */
  showRelativePath: true,

  /** File to store type coverage history (same as `--history-file`) */
  historyFile: 'typecoverage.json',

  /** Do not show details if coverage check fails (same as `--no-detail-when-failed`) */
  noDetailWhenFailed: true,

  /** Report semantic TypeScript errors (same as `--report-semantic-error`) */
  reportSemanticError: true,

  /** Directory to store cache (same as `--cache-directory`) */
  cacheDirectory: 'custom-directory',

  /** Do not restrict analysis to current working directory (same as `--not-only-in-cwd`) */
  notOnlyInCWD: true,

  /** Generate JSON output (same as `--json-output`) */
  jsonOutput: true,

  /** Report unused ignore directives (same as `--report-unused-ignore`) */
  reportUnusedIgnore: true,
};
