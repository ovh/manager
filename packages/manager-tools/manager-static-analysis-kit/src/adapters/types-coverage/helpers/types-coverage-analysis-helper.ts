import fs from 'node:fs';
import path from 'node:path';

import { typesCoverageConfig } from '../../../configs/types-coverage-config';
import {
  AppCoverageSummary,
  CoverageSummary,
  RawCoverageReport,
  WorstFileEntry,
} from '../types/TypesCoverage';

/**
 * Normalize a raw per-file entry into a consistent structure.
 */
function normalizeFileEntry(file: string, data: { correctCount?: number; totalCount?: number }) {
  const covered = data.correctCount ?? 0;
  const total = data.totalCount ?? 0;
  return {
    file,
    covered,
    total,
    percentage: total > 0 ? (covered / total) * 100 : 0,
  };
}

/**
 * Extracts the "worst covered" files from a report.
 */
function extractWorstFiles(report: RawCoverageReport): WorstFileEntry[] {
  if (!report.fileCounts) return [];
  const { threshold, count } = typesCoverageConfig.worstFiles;

  return Object.entries(report.fileCounts)
    .map(([file, f]) => normalizeFileEntry(file, f))
    .filter((f) => f.total > 0 && f.percentage < threshold)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, count)
    .map(
      (f) => [f.file, { covered: f.covered, total: f.total, percentage: f.percentage }] as const,
    );
}

/**
 * Compute coverage statistics for one app report.
 */
function computeAppCoverage(report: RawCoverageReport): Omit<AppCoverageSummary, 'error'> {
  const covered = report.covered ?? 0;
  const total = report.total ?? 0;
  const percentage = total > 0 ? (covered / total) * 100 : 0;

  const fileEntries = Object.entries(report.fileCounts ?? {}).map(([file, f]) =>
    normalizeFileEntry(file, f),
  );
  const percentages = fileEntries.filter((f) => f.total > 0).map((f) => f.percentage);

  const minPercentage = percentages.length ? Math.min(...percentages) : percentage;
  const maxPercentage = percentages.length ? Math.max(...percentages) : percentage;

  return {
    covered,
    total,
    percentage,
    minPercentage,
    maxPercentage,
    worstFiles: extractWorstFiles(report),
  };
}

/**
 * Collect and merge TypeScript type coverage reports across apps.
 */
export function collectTypesCoverage(reportOutputDir: string): CoverageSummary {
  const apps: Record<string, AppCoverageSummary> = {};
  let totalCovered = 0;
  let totalTypes = 0;

  if (!fs.existsSync(reportOutputDir)) {
    return { apps: {}, totalCovered: 0, totalTypes: 0, percentage: 0 };
  }

  const appDirs = fs
    .readdirSync(reportOutputDir)
    .filter((entry) => fs.statSync(path.join(reportOutputDir, entry)).isDirectory());

  for (const appDirName of appDirs) {
    const jsonPath = path.join(reportOutputDir, appDirName, 'typescript-coverage.json');
    if (!fs.existsSync(jsonPath)) continue;

    try {
      const report: RawCoverageReport = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      const stats = computeAppCoverage(report);

      apps[appDirName] = stats;
      totalCovered += stats.covered;
      totalTypes += stats.total;
    } catch (err) {
      apps[appDirName] = {
        covered: 0,
        total: 0,
        percentage: 0,
        error: (err as Error).message,
      };
    }
  }

  return {
    apps,
    totalCovered,
    totalTypes,
    percentage: totalTypes > 0 ? (totalCovered / totalTypes) * 100 : 0,
  };
}

/**
 * Determine coverage status color.
 */
function getReportStatusColor(percentage: number): 'green' | 'orange' | 'red' {
  const { green, orange } = typesCoverageConfig.thresholds;
  if (percentage >= green) return 'green';
  if (percentage >= orange) return 'orange';
  return 'red';
}

/**
 * Render a coverage percentage with color.
 */
function renderColoredPercentage(value: number): string {
  return `<span style="color:${getReportStatusColor(value)};">${value.toFixed(2)}%</span>`;
}

/**
 * Render details for worst files of an app.
 */
function renderWorstFiles(app: string, worstFiles: AppCoverageSummary['worstFiles'] = []) {
  if (!worstFiles.length) {
    return `
    <details class="coverage-details">
      <summary>📊 Type Coverage Overview for <strong>${app}</strong></summary>
      <p class="coverage-empty">
        It seems this project does not contain any <code>.ts</code> or <code>.tsx</code> files.
      </p>
    </details>`;
  }

  const rows = worstFiles
    .map(
      ([file, f]) => `
        <tr>
          <td colspan="2">${file}</td>
          <td>${f.covered}/${f.total}</td>
          <td>${renderColoredPercentage(f.percentage)}</td>
        </tr>`,
    )
    .join('');

  return `
    <details class="coverage-details">
      <summary>📊 Type Coverage Overview for <strong>${app}</strong></summary>
      <table class="coverage-subtable">
        <tbody>${rows}</tbody>
      </table>
    </details>`;
}

/**
 * Render the coverage cell (global + min/max range).
 */
function renderCoverageCell(stats: AppCoverageSummary) {
  const min = stats.minPercentage ?? 0;
  const max = stats.maxPercentage ?? 0;
  return `
    ${stats.percentage.toFixed(2)}% (range:
      ${renderColoredPercentage(min)} – ${renderColoredPercentage(max)})
  `;
}

/**
 * Render a single app row.
 */
function renderAppRow(app: string, stats: AppCoverageSummary) {
  if (stats.error) {
    return `<tr style="background:#ffe0e0">
      <td>${app}</td>
      <td colspan="3" style="color:red">${stats.error}</td>
    </tr>`;
  }

  // 🟢 use the min coverage instead of global %
  const colorKey = getReportStatusColor(stats.minPercentage ?? stats.percentage);
  const bg = colorKey === 'green' ? '#e6ffed' : colorKey === 'orange' ? '#fff8e1' : '#ffe6e6';

  return `
    <tr style="background:${bg}">
      <td>${app}</td>
      <td>${stats.covered}</td>
      <td>${stats.total}</td>
      <td style="font-weight:bold;">${renderCoverageCell(stats)}</td>
    </tr>
    <tr><td colspan="4">${renderWorstFiles(app, stats.worstFiles)}</td></tr>`;
}

/**
 * Build table rows for all apps.
 */
function buildRows(apps: Record<string, AppCoverageSummary>): string {
  return Object.entries(apps)
    .map(([app, stats]) => renderAppRow(app, stats))
    .join('');
}

/**
 * Generate the full HTML report.
 */
// eslint-disable-next-line max-lines-per-function
export function generateTypesCoverageHtml(summary: CoverageSummary): string {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>TypeScript Types Coverage Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; }
          h1 { margin-bottom: 1rem; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 2rem; }
          th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; vertical-align: top; }
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
        <h1>TypeScript Types Coverage Report</h1>
        <p>Total: ${summary.totalCovered} / ${summary.totalTypes}
           (${summary.percentage.toFixed(2)}%)</p>
        <table>
          <thead>
            <tr>
              <th>App</th>
              <th>Covered</th>
              <th>Total</th>
              <th>Coverage (range)</th>
            </tr>
          </thead>
          <tbody>${buildRows(summary.apps)}</tbody>
        </table>
      </body>
    </html>`;
}
