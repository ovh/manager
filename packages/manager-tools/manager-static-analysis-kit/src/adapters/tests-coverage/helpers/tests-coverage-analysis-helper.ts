import fs from 'node:fs';
import path from 'node:path';

import { testsCoverageConfig } from '../../../configs/tests-coverage-config';
import {
  CombinedTestsCoverage,
  TESTS_COVERAGE_KEYS,
  TestsCoverageRow,
  TestsCoverageSummary,
  WorstFileEntry,
} from '../types/TestsCoverage';

/**
 * Safely read and parse a JSON file.
 *
 * @template T
 * @param {string} file - Path to the JSON file.
 * @returns {T | null} Parsed JSON object, or null if the file does not exist or is invalid.
 */
function readJsonSafe<T = unknown>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T;
  } catch {
    return null;
  }
}

/**
 * Read an app’s `coverage-summary.json` file from `<reportRoot>/<app>/`.
 *
 * @param {string} reportRoot - Root directory containing per-app coverage reports.
 * @param {string} app - Application name (directory under report root).
 * @returns {TestsCoverageSummary | null} The parsed coverage summary, or null if missing/invalid.
 */
function readAppSummaryAt(reportRoot: string, app: string): TestsCoverageSummary | null {
  return readJsonSafe<TestsCoverageSummary>(path.join(reportRoot, app, 'coverage-summary.json'));
}

/**
 * Normalize a percentage-like value to [0..100] with two decimal places.
 *
 * @param {unknown} pct - The input value.
 * @returns {number} Normalized percentage.
 */
function normalizePct(pct: unknown): number {
  const n = Number(pct);
  if (!Number.isFinite(n) || n < 0) return 0;
  return +n.toFixed(2);
}

/**
 * Compute the worst covered files for one app by a chosen metric.
 *
 * Reads `<reportRoot>/<app>/coverage-summary.json` and skips the "total" bucket.
 *
 * @param {string} reportRoot - Root directory containing coverage reports.
 * @param {string} app - Application name.
 * @param {keyof TestsCoverageRow} [metric=testsCoverageConfig.worstFiles.metric] - Coverage metric to rank by.
 * @param {number} [threshold=testsCoverageConfig.worstFiles.threshold] - Minimum percentage; files below are included.
 * @param {number} [count=testsCoverageConfig.worstFiles.count] - Maximum number of files to return.
 * @returns {WorstFileEntry[]} Sorted array of worst-covered files.
 */
// eslint-disable-next-line max-params
function extractWorstFilesForApp(
  reportRoot: string,
  app: string,
  metric: keyof TestsCoverageRow = testsCoverageConfig.worstFiles.metric,
  threshold = testsCoverageConfig.worstFiles.threshold,
  count = testsCoverageConfig.worstFiles.count,
): WorstFileEntry[] {
  const summary = readAppSummaryAt(reportRoot, app);
  if (!summary) return [];

  const rows: WorstFileEntry[] = [];

  for (const [key, value] of Object.entries(summary)) {
    if (key === 'total') continue;
    const bucket = (value as TestsCoverageRow | undefined)?.[metric];
    if (!bucket) continue;

    const total = bucket.total ?? 0;
    const covered = bucket.covered ?? 0;
    if (!Number.isFinite(total) || total <= 0) continue;

    const percentage = normalizePct(bucket.pct);
    if (percentage >= threshold) continue;

    rows.push([key, { covered, total, percentage }]);
  }

  // Sort by asc % then by larger totals
  rows.sort(
    (a, b) =>
      a[1].percentage - b[1].percentage || b[1].total - a[1].total || a[0].localeCompare(b[0]),
  );

  return rows.slice(0, Math.max(0, count));
}

/**
 * Add two coverage rows together, summing totals and covered counts.
 * Recomputes percentages accordingly.
 *
 * @param {TestsCoverageRow} a - First row.
 * @param {TestsCoverageRow} b - Second row.
 * @returns {TestsCoverageRow} Combined totals row.
 */
function addTotals(a: TestsCoverageRow, b: TestsCoverageRow): TestsCoverageRow {
  const out = {} as TestsCoverageRow;
  for (const k of TESTS_COVERAGE_KEYS) {
    const A = a[k] ?? { total: 0, covered: 0, pct: 0 };
    const B = b[k] ?? { total: 0, covered: 0, pct: 0 };
    const total = (A.total ?? 0) + (B.total ?? 0);
    const covered = (A.covered ?? 0) + (B.covered ?? 0);
    out[k] = {
      total,
      covered,
      pct: total > 0 ? normalizePct((100 * covered) / total) : 0,
    };
  }
  return out;
}

/**
 * Collect coverage summaries across all applications under a report root.
 *
 * Builds a combined object with:
 * - `apps`: Per-application totals.
 * - `totals`: Global totals across all apps.
 *
 * @param {string} reportRoot - Root directory containing per-app coverage reports.
 * @returns {CombinedTestsCoverage} Combined coverage object.
 */
export function collectTestsCoverage(reportRoot: string): CombinedTestsCoverage {
  if (!fs.existsSync(reportRoot)) return { apps: {}, totals: undefined };

  const appDirs = (() => {
    try {
      return fs
        .readdirSync(reportRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
    } catch {
      return [];
    }
  })();

  const apps: Record<string, TestsCoverageRow> = {};
  let totals: TestsCoverageRow | undefined;

  for (const app of appDirs) {
    const summary = readAppSummaryAt(reportRoot, app);
    const total = summary?.total;
    if (!total) continue;

    const row = {} as TestsCoverageRow;
    for (const k of TESTS_COVERAGE_KEYS) {
      const g = total[k];
      row[k] = g
        ? { total: g.total ?? 0, covered: g.covered ?? 0, pct: normalizePct(g.pct) }
        : { total: 0, covered: 0, pct: 0 };
    }

    apps[app] = row;
    totals = totals ? addTotals(totals, row) : row;
  }

  return { apps, totals };
}

/**
 * Map a percentage to a traffic-light color.
 *
 * @param {number} pct - Coverage percentage.
 * @returns {'green' | 'orange' | 'red'} Status color.
 */
function getTestsCoverageStatusColor(pct: number): 'green' | 'orange' | 'red' {
  const { green, orange } = testsCoverageConfig.thresholds;
  if (pct >= green) return 'green';
  if (pct >= orange) return 'orange';
  return 'red';
}

/**
 * Render a collapsible HTML block listing the worst-covered files for an app.
 *
 * @param {string} app - Application name.
 * @param {WorstFileEntry[]} worst - Worst files list.
 * @returns {string} HTML block.
 */
function renderWorstFiles(app: string, worst: WorstFileEntry[]) {
  const { threshold, metric } = testsCoverageConfig.worstFiles;

  if (!worst.length) {
    return `
      <details>
        <summary>⚠️ Worst covered files (${metric})</summary>
        <p style="margin:0.5rem 0; color:#888;">No files below threshold 🎉</p>
      </details>`;
  }

  const rows = worst
    .map(
      ([file, f]) => `
        <tr>
          <td colspan="2">${file}</td>
          <td>${f.covered}/${f.total}</td>
          <td style="color:${getTestsCoverageStatusColor(f.percentage)}">${f.percentage.toFixed(2)}%</td>
        </tr>`,
    )
    .join('');

  return `
    <details>
      <summary>⚠️ Worst covered files (below ${threshold}% — ${metric})</summary>
      <table style="margin:0.5rem 0; border:1px solid #ccc; width:95%;">
        <tbody>${rows}</tbody>
      </table>
    </details>`;
}

/**
 * Generate an HTML report for test coverage.
 *
 * Includes:
 * - A combined table of coverage per app and totals.
 * - Collapsible blocks of worst-covered files per app.
 *
 * @param {CombinedTestsCoverage} summary - Combined test coverage summary.
 * @param {string} reportRoot - Root directory used to resolve per-app summaries.
 * @returns {string} Complete HTML report.
 */
// eslint-disable-next-line max-lines-per-function
export function generateTestsCoverageHtml(
  summary: CombinedTestsCoverage,
  reportRoot: string,
): string {
  const head = `
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; }
    h1 { margin-bottom: 1rem; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 2rem; }
    th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; vertical-align: top; }
    th { background: #f0f0f0; }
    details summary { cursor: pointer; font-weight: bold; }
    .green { color: #0a0; }
    .orange { color: #c80; }
    .red { color: #c00; }
    .row-green { background:#e6ffed; }
    .row-orange { background:#fff8e1; }
    .row-red { background:#ffe6e6; }
  </style>
  <h1>Tests Coverage — Combined Report</h1>
  `;

  const appRow = (app: string, r: TestsCoverageRow) => {
    // color the whole row by the main metric (lines)
    const status = getTestsCoverageStatusColor(r.lines?.pct ?? 0);
    return `
      <tr class="row-${status}">
        <td>${app}</td>
        ${TESTS_COVERAGE_KEYS.map((k) => {
          const pct = r[k]?.pct ?? 0;
          const cls = getTestsCoverageStatusColor(pct);
          return `<td class="${cls}" style="font-weight:600">${pct}%</td>`;
        }).join('')}
      </tr>
      <tr>
        <td colspan="5">
          ${renderWorstFiles(app, extractWorstFilesForApp(reportRoot, app))}
        </td>
      </tr>
    `;
  };

  const totalsRow = summary.totals
    ? `
      <tr>
        <td><b>Totals</b></td>
        ${TESTS_COVERAGE_KEYS.map((k) => {
          const pct = summary.totals?.[k]?.pct ?? 0;
          const cls = getTestsCoverageStatusColor(pct);
          return `<td class="${cls}"><b>${pct}%</b></td>`;
        }).join('')}
      </tr>`
    : '';

  const table = `
  <table>
    <thead>
      <tr>
        <th>Application</th>
        <th>Lines %</th>
        <th>Branches %</th>
        <th>Functions %</th>
        <th>Statements %</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(summary.apps)
        .map(([app, r]) => appRow(app, r))
        .join('')}
      ${totalsRow}
    </tbody>
  </table>`;

  return `<!doctype html><meta charset="utf-8">${head}${table}`;
}
