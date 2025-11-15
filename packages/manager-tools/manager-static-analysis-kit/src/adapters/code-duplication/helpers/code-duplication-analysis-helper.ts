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
import {
  buildDuplicationReportBody,
  buildDuplicationReportHead,
} from './code-duplication-reports-render';

/**
 * Return an extension-priority bucket for sorting:
 * 0 → TS/TSX (.mts/.cts, excluding .d.ts),
 * 1 → JS/JSX (.mjs/.cjs),
 * 2 → others.
 *
 * @param {string} file - Absolute or relative path
 * @returns {number} Priority bucket
 */
export const buildExtensionPriority = (file: string): number => {
  const f = file.toLowerCase();
  if (/\.(d\.ts)$/.test(f)) return 2;
  if (/\.(tsx?|mts|cts)$/.test(f)) return 0;
  if (/\.(jsx?|mjs|cjs)$/.test(f)) return 1;
  return 2;
};

/**
 * Count file lines; returns 0 if unreadable.
 * @param {string} file
 * @returns {number}
 */
const countRealLines = (file: string): number => {
  try {
    const txt = fs.readFileSync(file, 'utf8');
    return txt.split(/\r?\n/).length;
  } catch {
    return 0;
  }
};

/**
 * Build the "worst files" list from a jscpd v4+ JSON report.
 */
export function extractWorstFiles(report: JscpdReportV4) {
  const dups = Array.isArray(report?.duplicates) ? report.duplicates : [];
  if (dups.length === 0) return { files: [], fileCount: 0 };

  const { threshold, count } = codeDuplicationConfig.worstFiles;
  const fileMap: Record<string, { dup: number; estimatedTotal: number; total?: number }> = {};

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

  for (const file of Object.keys(fileMap)) {
    const realTotal = countRealLines(file);
    const estTotal = fileMap[file].estimatedTotal;
    fileMap[file].total = Math.max(realTotal || estTotal || 0, fileMap[file].dup);
  }

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
      const pa = buildExtensionPriority(a[0]);
      const pb = buildExtensionPriority(b[0]);
      if (pa !== pb) return pa - pb;
      const pct = b[1].percentage - a[1].percentage;
      if (pct !== 0) return pct;
      if (b[1].duplicatedLines !== a[1].duplicatedLines)
        return b[1].duplicatedLines - a[1].duplicatedLines;
      if (b[1].totalLines !== a[1].totalLines) return b[1].totalLines - a[1].totalLines;
      return a[0].localeCompare(b[0]);
    })
    .slice(0, count);

  return { files, fileCount: Object.keys(fileMap).length };
}

/**
 * Parse one app’s `jscpd-report.json` into a normalized summary.
 * @param {string} jsonPath
 * @returns {AppCodeDuplicationSummary}
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
      filesWithDuplication: fileCount,
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
 * Aggregate totals from all per-app summaries.
 * @param {Record<string, AppCodeDuplicationSummary>} apps
 */
function aggregateDuplicationTotals(apps: Record<string, AppCodeDuplicationSummary>) {
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
 * Collect all per-app reports and build a combined summary.
 * @param {string} reportOutputDir
 * @returns {CombinedCodeDuplicationSummary}
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

  const totals = aggregateDuplicationTotals(apps);

  return {
    apps,
    ...totals,
    percentage: totals.totalLines > 0 ? (totals.totalDuplicateLines / totals.totalLines) * 100 : 0,
  };
}

/**
 * Generate the complete HTML report for code duplication.
 * @param {CombinedCodeDuplicationSummary} summary
 * @returns {string}
 */
export function generateCodeDuplicationHtml(summary: CombinedCodeDuplicationSummary): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      ${buildDuplicationReportHead()}
      ${buildDuplicationReportBody(summary)}
    </html>
  `.trim();
}
