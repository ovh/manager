/**
 * Supported coverage buckets.
 *
 * These correspond to the four coverage dimensions that Istanbul/Vitest/Jest provide.
 */
export type TestsCoverageKey = 'lines' | 'branches' | 'functions' | 'statements';

/**
 * Coverage keys we aggregate across.
 *
 * This array is used when summing or rendering totals.
 */
export const TESTS_COVERAGE_KEYS: readonly TestsCoverageKey[] = [
  'lines',
  'branches',
  'functions',
  'statements',
] as const;

/**
 * One coverage metric bucket.
 *
 * Example: line coverage `{ total: 100, covered: 85, pct: 85 }`.
 */
export interface TestsCoverageBucket {
  /** Total count of items (e.g., total lines, branches, functions, or statements). */
  total: number;
  /** Count of items covered by tests. */
  covered: number;
  /** Covered percentage (0–100). */
  pct: number;
}

/**
 * Row of coverage data for one app (or overall totals).
 *
 * Indexed by the four standard coverage keys.
 */
export type TestsCoverageRow = Record<TestsCoverageKey, TestsCoverageBucket>;

/**
 * Combined JSON shape emitted by the CLI.
 *
 * - `apps`: Per-app totals
 * - `totals`: Optional global totals across all apps
 */
export interface CombinedTestsCoverage {
  apps: Record<string, TestsCoverageRow>;
  totals?: TestsCoverageRow;
}

/**
 * Shape of Istanbul/Vitest/Jest `coverage-summary.json`.
 * Only the `total` section is used for aggregated reporting.
 *
 * Example (simplified):
 * ```json
 * {
 *   "total": {
 *     "lines":     { "total": 100, "covered": 90, "pct": 90 },
 *     "branches":  { "total": 50,  "covered": 40, "pct": 80 },
 *     "functions": { "total": 20,  "covered": 18, "pct": 90 },
 *     "statements":{ "total": 110, "covered": 95, "pct": 86.36 }
 *   },
 *   "src/file.ts": { ... }
 * }
 * ```
 */
export interface TestsCoverageSummary {
  /** Aggregated totals, may be partial if the runner omits some buckets. */
  total?: Partial<Record<TestsCoverageKey, Partial<TestsCoverageBucket>>>;
}

/**
 * Alias for allowed coverage metric keys.
 * Equivalent to `keyof TestsCoverageRow`.
 */
export type TestsCoverageMetric = keyof TestsCoverageRow; // 'lines' | 'branches' | 'functions' | 'statements'

/**
 * Options for generating collapsible “worst files” blocks in HTML reports.
 */
export interface WorstFilesOptions {
  /** Absolute directory holding `<app>/coverage-summary.json` folders. */
  reportRoot: string;
  /** Number of least-covered files to show per app. */
  count: number;
  /** Coverage bucket to use for ranking worst files. */
  metric: TestsCoverageMetric;
}

/**
 * Internal shape for a single file’s coverage row.
 *
 * Used when rendering per-file details.
 */
export interface FileCoverageRow {
  /** File path (relative to app root). */
  file: string;
  /** Total count of items (lines, branches, etc.). */
  total: number;
  /** Covered items count. */
  covered: number;
  /** Covered percentage (0–100). */
  pct: number;
}

/**
 * A tuple representing a worst-covered file entry.
 *
 * - `file`: File path (string)
 * - `stats`: Coverage numbers (covered, total, percentage)
 */
export type WorstFileEntry = readonly [
  file: string,
  stats: { covered: number; total: number; percentage: number },
];
