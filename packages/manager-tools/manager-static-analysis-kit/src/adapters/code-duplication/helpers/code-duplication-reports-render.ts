import { codeDuplicationConfig } from '../../../configs/code-duplication-config';
import {
  AppCodeDuplicationSummary,
  CombinedCodeDuplicationSummary,
} from '../types/CodeDuplication';

/**
 * Return a normalized short path starting at `apps/`.
 * @param {string} filePath
 * @returns {string}
 */
function buildDisplayedFilePath(filePath: string): string {
  const norm = filePath.replace(/\\/g, '/');
  const appsIdx = norm.indexOf('/apps/');
  if (appsIdx >= 0) return norm.slice(appsIdx + 1);
  const parts = norm.split('/');
  return parts.slice(Math.max(0, parts.length - 5)).join('/');
}

/**
 * @param {number} pct
 * @returns {'green'|'orange'|'red'}
 */
const buildDuplicationColorStatus = (pct: number): string => {
  const green = codeDuplicationConfig.thresholds?.green ?? 10;
  const orange = codeDuplicationConfig.thresholds?.orange ?? 20;
  return pct < green ? 'green' : pct < orange ? 'orange' : 'red';
};

/**
 * Build the collapsible block for an app’s worst duplicated files.
 * @param app
 * @param worstFiles
 */
function buildDuplicationWorstFiles(
  app: string,
  worstFiles: AppCodeDuplicationSummary['worstFiles'] = [],
) {
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
      const short = buildDisplayedFilePath(file);
      const color = buildDuplicationColorStatus(f.percentage);
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
 * Build a single duplication percentage cell (with optional min–max range).
 */
function buildDuplicationCell(stats: AppCodeDuplicationSummary) {
  const min = stats.minPercentage ?? stats.percentage;
  const max = stats.maxPercentage ?? stats.percentage;

  if (stats.duplicateLines === 0) {
    return `<span style="color:${buildDuplicationColorStatus(0)}">0.00%</span>`;
  }

  if (min.toFixed(2) === max.toFixed(2)) {
    return `
      ${stats.percentage.toFixed(2)}% (${stats.filesWithDuplication} files cluster at
      <span style="color:${buildDuplicationColorStatus(min)}">${min.toFixed(2)}%</span>)
    `;
  }

  return `
    ${stats.percentage.toFixed(2)}% (range:
      <span style="color:${buildDuplicationColorStatus(min)}">${min.toFixed(2)}%</span> –
      <span style="color:${buildDuplicationColorStatus(max)}">${max.toFixed(2)}%</span>)
  `;
}

/**
 * Build one HTML row summarizing duplication stats for an app.
 * @param {string} app
 * @param {AppCodeDuplicationSummary} stats
 * @returns {string}
 */
function buildAppRow(app: string, stats: AppCodeDuplicationSummary): string {
  if (stats.error) {
    return `<tr style="background:#ffe0e0">
      <td>${app}</td>
      <td colspan="5" style="color:red">${stats.error}</td>
    </tr>`;
  }

  const max = stats.maxPercentage ?? stats.percentage;
  const rowColor = buildDuplicationColorStatus(max);
  const bg = rowColor === 'green' ? '#e6ffed' : rowColor === 'orange' ? '#fff8e1' : '#ffe6e6';

  return `
<tr style="background:${bg}">
  <td>${app}</td>
  <td>${stats.totalLines}</td>
  <td>${stats.duplicateLines}</td>
  <td>${stats.clonesCount}</td>
  <td style="font-weight:bold;">${buildDuplicationCell(stats)}</td>
</tr>
<tr><td colspan="5">${buildDuplicationWorstFiles(app, stats.worstFiles)}</td></tr>`;
}

/**
 * Build the `<head>` block of the HTML report.
 * @returns {string}
 */
export function buildDuplicationReportHead(): string {
  return `
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
          .coverage-details summary { font-weight: bold; cursor: pointer; }
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
  `.trim();
}

/**
 * Build the `<body>` block of the HTML report.
 * @param {CombinedCodeDuplicationSummary} summary
 * @returns {string}
 */
export function buildDuplicationReportBody(summary: CombinedCodeDuplicationSummary): string {
  const rows = Object.entries(summary.apps)
    .map(([app, stats]) => buildAppRow(app, stats))
    .join('');
  return `
    <body>
      <h1>Code Duplication Report</h1>
      <p>
        Total lines: ${summary.totalLines},
        Duplicate lines: ${summary.totalDuplicateLines},
        Percentage: ${summary.percentage.toFixed(2)}%
      </p>
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
  `.trim();
}
