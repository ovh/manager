import fs from 'node:fs';
import path from 'node:path';

import { codeDuplicationConfig } from '../../../configs/code-duplication-config';
import {
  AppCodeDuplicationSummary,
  CombinedCodeDuplicationSummary,
  JscpdReportV4,
  WorstCodeDuplicationFile,
  WorstFileStats,
} from '../types/CodeDuplication';

/**
 * Return an extension-priority bucket for sorting:
 * 0 → TS/TSX (incl. .mts/.cts, excluding .d.ts by default),
 * 1 → JS/JSX (incl. .mjs/.cjs),
 * 2 → everything else.
 *
 * @param file absolute or relative path
 */
export const extPriority = (file: string): number => {
  const f = file.toLowerCase();

  // Treat declaration files as "other" so they don't crowd the list.
  if (/\.(d\.ts)$/.test(f)) return 2;

  // TS family
  if (/\.(tsx?|mts|cts)$/.test(f)) return 0;

  // JS family
  if (/\.(jsx?|mjs|cjs)$/.test(f)) return 1;

  // Everything else
  return 2;
};

/**
 * Count the number of lines in a file. If the file cannot be read (e.g., in CI with
 * partial checkouts), returns 0 so the caller can fall back to an estimate.
 *
 * @param file absolute or relative path
 * @returns number of text lines (>= 0)
 */
const safeCountLines = (file: string): number => {
  try {
    const txt = fs.readFileSync(file, 'utf8');
    // Robust split (handles LF/CRLF and missing final newline)
    return txt.split(/\r?\n/).length;
  } catch {
    return 0;
  }
};

/**
 * Return a display-friendly path that starts at "apps/<appName>/".
 * - Strips any absolute prefixes (e.g., "/Users/.../packages/manager/").
 * - Works on Windows and POSIX paths.
 * - If "/apps/" is not found, falls back to the last 5 segments.
 *
 * @param filePath Absolute or relative file path from the jscpd report.
 * @param app Optional app name (unused for slicing, but kept for future tweaks).
 * @returns Short path like "apps/container/src/...".
 */
function shortPathFromAppsRoot(filePath: string, app?: string): string {
  // Normalize separators
  const norm = filePath.replace(/\\/g, '/');

  // Best case: slice from the first "/apps/"
  const appsIdx = norm.indexOf('/apps/');
  if (appsIdx >= 0) {
    // remove leading slash so we return "apps/…"
    return norm.slice(appsIdx + 1);
  }

  // Fallback: keep only the tail to avoid super long paths
  const parts = norm.split('/');
  return parts.slice(Math.max(0, parts.length - 5)).join('/');
}

/**
 * Build the "worst files" list from a jscpd v4+ JSON report.
 *
 * Why this is necessary:
 * - jscpd v4 no longer exposes a per-file "total lines" map.
 * - We aggregate duplicated lines per file from `report.duplicates`.
 * - For each file, we compute a reliable denominator:
 *   1) Prefer reading the file to count its lines,
 *   2) Otherwise fall back to the maximum `endLoc.line` seen for that file,
 *   3) Ensure the denominator is at least the duplicated lines to avoid >100% / div-by-zero.
 *
 * Sorting & selection:
 * - First by extension priority (TS/TSX → JS/JSX → others),
 * - Then by percentage desc,
 * - Then by duplicated lines desc,
 * - Then by total lines desc,
 * - Finally by filename (stable tie-break).
 *
 * @param report Parsed jscpd v4 JSON
 * @returns { files: WorstCodeDuplicationFile[], fileCount: number }
 */
// eslint-disable-next-line max-lines-per-function
export function extractWorstFiles(report: JscpdReportV4): {
  files: WorstCodeDuplicationFile[];
  fileCount: number;
} {
  const dups = Array.isArray(report?.duplicates) ? report.duplicates : [];
  if (dups.length === 0) return { files: [], fileCount: 0 };

  const { threshold, count } = codeDuplicationConfig.worstFiles;

  // Map file → aggregated duplication + a conservative estimate of total lines
  const fileMap: Record<string, { dup: number; estimatedTotal: number; total?: number }> = {};

  // Aggregate duplicated lines, and track the largest end line as a fallback "total"
  for (const dup of dups) {
    const lines = Number(dup?.lines ?? 0);
    if (!lines) continue;

    for (const side of [dup.firstFile, dup.secondFile]) {
      const file = side?.name;
      if (!file) continue;

      const endLine = Number(side?.endLoc?.line ?? 0);
      const entry = fileMap[file] ?? { dup: 0, estimatedTotal: 0 };
      entry.dup += lines;
      if (endLine > entry.estimatedTotal) entry.estimatedTotal = endLine;
      fileMap[file] = entry;
    }
  }

  // Resolve real totals (prefer filesystem, else estimate)
  for (const file of Object.keys(fileMap)) {
    const realTotal = safeCountLines(file);
    const estTotal = fileMap[file].estimatedTotal;
    // Ensure denominator is sane: at least duplicated lines, never zero
    fileMap[file].total = Math.max(realTotal || estTotal || 0, fileMap[file].dup);
  }

  // Build, filter, sort, and cap the list
  const files = Object.entries(fileMap)
    .map(([file, { dup, total = 0 }]) => {
      const percentage = total > 0 ? (dup / total) * 100 : 0;
      const stats: WorstFileStats = {
        duplicatedLines: dup,
        totalLines: total,
        percentage,
      };
      return [file, stats] as WorstCodeDuplicationFile;
    })
    .filter(([, s]) => s.percentage >= threshold)
    .sort((a, b) => {
      // 1) extension priority
      const pa = extPriority(a[0]);
      const pb = extPriority(b[0]);
      if (pa !== pb) return pa - pb;

      // 2) percentage desc
      const pct = b[1].percentage - a[1].percentage;
      if (pct !== 0) return pct;

      // 3) duplicated lines desc
      if (b[1].duplicatedLines !== a[1].duplicatedLines) {
        return b[1].duplicatedLines - a[1].duplicatedLines;
      }

      // 4) total lines desc
      if (b[1].totalLines !== a[1].totalLines) {
        return b[1].totalLines - a[1].totalLines;
      }

      // 5) stable filename order
      return a[0].localeCompare(b[0]);
    })
    .slice(0, count);

  return { files, fileCount: Object.keys(fileMap).length };
}

/**
 * Parse a single `jscpd-report.json` into a normalized summary.
 *
 * @param {string} jsonPath - Absolute path to the app’s `jscpd-report.json`.
 * @returns {AppCodeDuplicationSummary} Summary containing duplication stats and worst files.
 */
function parseAppCodeDuplicationReport(jsonPath: string): AppCodeDuplicationSummary {
  try {
    const report: JscpdReportV4 = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const total = report.statistics?.total ?? {};

    const totalLines = total.lines ?? 0;
    const duplicateLines = total.duplicatedLines ?? 0;
    const percentage =
      total.percentage ?? (totalLines > 0 ? (duplicateLines / totalLines) * 100 : 0);

    const { files: worstFiles, fileCount } = extractWorstFiles(report);

    // compute per-file percentages for min/max
    const perFilePercentages = worstFiles.map(([, f]) => f.percentage);
    const minPercentage = perFilePercentages.length ? Math.min(...perFilePercentages) : percentage;
    const maxPercentage = perFilePercentages.length ? Math.max(...perFilePercentages) : percentage;

    return {
      totalLines,
      totalTokens: total.tokens ?? 0,
      duplicateLines,
      duplicateTokens: total.duplicatedTokens ?? 0,
      clonesCount: total.clones ?? 0,
      percentage,
      minPercentage,
      maxPercentage,
      worstFiles,
      filesWithDuplication: fileCount, // NEW
    };
  } catch (err) {
    return {
      totalLines: 0,
      totalTokens: 0,
      duplicateLines: 0,
      duplicateTokens: 0,
      clonesCount: 0,
      percentage: 0,
      minPercentage: 0,
      maxPercentage: 0,
      error: (err as Error).message,
      worstFiles: [],
      filesWithDuplication: 0,
    };
  }
}

/**
 * Aggregate global totals from all per-app summaries.
 *
 * @param {Record<string, AppCodeDuplicationSummary>} apps - Map of app name to summary.
 */
function aggregateTotals(apps: Record<string, AppCodeDuplicationSummary>) {
  return Object.values(apps).reduce(
    (acc, app) => {
      acc.totalLines += app.totalLines;
      acc.totalTokens += app.totalTokens;
      acc.totalDuplicateLines += app.duplicateLines;
      acc.totalDuplicateTokens += app.duplicateTokens;
      return acc;
    },
    { totalLines: 0, totalTokens: 0, totalDuplicateLines: 0, totalDuplicateTokens: 0 },
  );
}

/**
 * Collect all `jscpd-report.json` files from a report directory, parse them,
 * and merge into a combined summary across apps.
 */
export function collectCodeDuplication(reportOutputDir: string): CombinedCodeDuplicationSummary {
  if (!fs.existsSync(reportOutputDir)) {
    return {
      apps: {},
      totalLines: 0,
      totalTokens: 0,
      totalDuplicateLines: 0,
      totalDuplicateTokens: 0,
      percentage: 0,
    };
  }

  const apps: Record<string, AppCodeDuplicationSummary> = {};
  const appDirs = fs
    .readdirSync(reportOutputDir)
    .filter((entry) => fs.statSync(path.join(reportOutputDir, entry)).isDirectory());

  for (const appDirName of appDirs) {
    const jsonPath = path.join(reportOutputDir, appDirName, 'jscpd-report.json');
    if (fs.existsSync(jsonPath)) {
      apps[appDirName] = parseAppCodeDuplicationReport(jsonPath);
    }
  }

  const totals = aggregateTotals(apps);

  return {
    apps,
    ...totals,
    percentage: totals.totalLines > 0 ? (totals.totalDuplicateLines / totals.totalLines) * 100 : 0,
  };
}

/**
 * Returns the traffic-light color representing duplication severity for a given percentage.
 */
const getColorForDuplicationStatus = (pct: number): string => {
  const green = codeDuplicationConfig.thresholds?.green ?? 10;
  const orange = codeDuplicationConfig.thresholds?.orange ?? 20;
  return pct < green ? 'green' : pct < orange ? 'orange' : 'red';
};

/**
 * Render a collapsible HTML <details> block for worst duplicated files of an app.
 */
function renderWorstFiles(app: string, worstFiles: AppCodeDuplicationSummary['worstFiles'] = []) {
  const threshold = codeDuplicationConfig.worstFiles.threshold;

  if (!worstFiles.length) {
    return `
      <details class="coverage-details">
        <summary>📊 Duplication Overview for <strong>${app}</strong></summary>
        <p class="coverage-empty">No files above threshold 🎉</p>
      </details>`;
  }

  const rows = worstFiles
    .map(([file, f]) => {
      const short = shortPathFromAppsRoot(file, app);
      const color = getColorForDuplicationStatus(f.percentage);
      return `
        <tr>
          <td colspan="2" title="${file}">${short}</td>
          <td>${f.duplicatedLines}/${f.totalLines}</td>
          <td style="color:${color}">${f.percentage.toFixed(2)}%</td>
        </tr>`;
    })
    .join('');

  return `
    <details class="coverage-details">
      <summary>📊 Duplication Overview for <strong>${app}</strong> (≥ ${threshold}%)</summary>
      <table class="coverage-subtable">
        <tbody>${rows}</tbody>
      </table>
    </details>`;
}

/**
 * Render the duplication percentage cell with optional min–max range.
 */
function renderDuplicationCell(stats: AppCodeDuplicationSummary) {
  const min = stats.minPercentage ?? stats.percentage;
  const max = stats.maxPercentage ?? stats.percentage;

  if (stats.duplicateLines === 0) {
    return `<span style="color:${getColorForDuplicationStatus(0)}">0.00%</span>`;
  }

  if (min.toFixed(2) === max.toFixed(2)) {
    // All worst files cluster at the same percentage
    return `
      ${stats.percentage.toFixed(2)}% (${stats.filesWithDuplication} files cluster at
      <span style="color:${getColorForDuplicationStatus(min)}">${min.toFixed(2)}%</span>)
    `;
  }

  return `
    ${stats.percentage.toFixed(2)}% (range:
      <span style="color:${getColorForDuplicationStatus(min)}">${min.toFixed(2)}%</span> –
      <span style="color:${getColorForDuplicationStatus(max)}">${max.toFixed(2)}%</span>)
  `;
}

/**
 * Build a single HTML row summarizing duplication stats for one app.
 */
function buildAppRow(app: string, stats: AppCodeDuplicationSummary): string {
  if (stats.error) {
    return `<tr style="background:#ffe0e0">
      <td>${app}</td>
      <td colspan="5" style="color:red">${stats.error}</td>
    </tr>`;
  }

  const max = stats.maxPercentage ?? stats.percentage;
  const rowColor = getColorForDuplicationStatus(max);
  const bg = rowColor === 'green' ? '#e6ffed' : rowColor === 'orange' ? '#fff8e1' : '#ffe6e6';

  return `
<tr style="background:${bg}">
  <td>${app}</td>
  <td>${stats.totalLines}</td>
  <td>${stats.duplicateLines}</td>
  <td>${stats.clonesCount}</td>
  <td style="font-weight:bold;">${renderDuplicationCell(stats)}</td>
</tr>
<tr><td colspan="5">${renderWorstFiles(app, stats.worstFiles)}</td></tr>`;
}

/**
 * Generate a full HTML report summarizing code duplication across apps.
 */
export function generateCodeDuplicationHtml(summary: CombinedCodeDuplicationSummary): string {
  const rows = Object.entries(summary.apps)
    .map(([app, stats]) => buildAppRow(app, stats))
    .join('');

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>Code Duplication Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
          th { background: #f0f0f0; }
          .coverage-details {
            margin: 0.3rem 0 0.8rem 1.5rem;
            padding: 0.5rem;
            border-left: 3px solid #ccc;
            background: #fafafa;
            border-radius: 4px;
          }
          .coverage-details summary {
            font-weight: bold;
            cursor: pointer;
          }
          .coverage-subtable {
            margin-top: 0.5rem;
            border: 1px solid #ddd;
            width: 95%;
            font-size: 0.9em;
          }
          .coverage-empty {
            margin: 0.5rem 0;
            color: #888;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <h1>Code Duplication Report</h1>
        <p>Total lines: ${summary.totalLines}, Duplicate lines: ${summary.totalDuplicateLines},
        Percentage: ${summary.percentage.toFixed(2)}%</p>
        <table>
          <thead>
            <tr>
              <th>App</th>
              <th>Total lines</th>
              <th>Duplicate lines</th>
              <th>Clones</th>
              <th>Duplication %</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>`;
}
