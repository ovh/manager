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
 * Parse a raw per-file entry into a normalized structure.
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
 * Compute worst files for a given report.
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
 * Collect and merge TypeScript types coverage reports from per-app outputs.
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
      const covered = report.covered ?? 0;
      const total = report.total ?? 0;
      const percentage = total > 0 ? (covered / total) * 100 : 0;

      const appShortName = appDirName.replace(/^manager-/, '').replace(/-app$/, '');

      apps[appShortName] = {
        covered,
        total,
        percentage,
        worstFiles: extractWorstFiles(report),
      };

      totalCovered += covered;
      totalTypes += total;
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
 * Determine the coverage status color for a given percentage.
 */
function getReportStatusColor(percentage: number): 'green' | 'orange' | 'red' {
  const { green, orange } = typesCoverageConfig.thresholds;
  if (percentage >= green) return 'green';
  if (percentage >= orange) return 'orange';
  return 'red';
}

/**
 * Render worst files as an HTML <details> block.
 */
function renderWorstFiles(app: string, worstFiles: AppCoverageSummary['worstFiles'] = []) {
  if (!worstFiles.length) {
    return `
      <details>
        <summary>⚠️ Worst covered files</summary>
        <p style="margin:0.5rem 0; color:#888;">No files below threshold 🎉</p>
      </details>`;
  }

  const rows = worstFiles
    .map(
      ([file, f]) => `
        <tr>
          <td colspan="2">${file}</td>
          <td>${f.covered}/${f.total}</td>
          <td style="color:${getReportStatusColor(f.percentage)}">
            ${f.percentage.toFixed(2)}%
          </td>
        </tr>`,
    )
    .join('');

  return `
    <details>
      <summary>⚠️ Worst covered files (below ${typesCoverageConfig.worstFiles.threshold}%)</summary>
      <table style="margin:0.5rem 0; border:1px solid #ccc; width:95%;">
        <tbody>${rows}</tbody>
      </table>
    </details>`;
}

/**
 * Build HTML table rows for per-app coverage with worst-file drilldown.
 */
function buildRows(apps: Record<string, AppCoverageSummary>): string {
  return Object.entries(apps)
    .map(([app, stats]) => {
      if (stats.error) {
        return `<tr style="background:#ffe0e0">
          <td>${app}</td>
          <td colspan="3" style="color:red">${stats.error}</td>
        </tr>`;
      }

      const status = getReportStatusColor(stats.percentage);
      const statusBg = status === 'green' ? '#e6ffed' : status === 'orange' ? '#fff8e1' : '#ffe6e6';

      return `
        <tr style="background:${statusBg}">
          <td>${app}</td>
          <td>${stats.covered}</td>
          <td>${stats.total}</td>
          <td style="font-weight:bold;">${stats.percentage.toFixed(2)}%</td>
        </tr>
        <tr><td colspan="4">${renderWorstFiles(app, stats.worstFiles)}</td></tr>`;
    })
    .join('');
}

/**
 * Generate an HTML page summarizing TypeScript types coverage across apps.
 */
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
          details summary { cursor: pointer; font-weight: bold; }
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
              <th>Coverage</th>
            </tr>
          </thead>
          <tbody>${buildRows(summary.apps)}</tbody>
        </table>
      </body>
    </html>`;
}
