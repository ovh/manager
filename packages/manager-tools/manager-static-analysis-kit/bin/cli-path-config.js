import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const rootDir = path.resolve(__dirname, '../../..');
export const outputRootDir = path.resolve(__dirname, '../../../../static-dynamic-quality-reports');

export const appsDir = path.join(rootDir, 'manager/apps');

export const bundleAnalyzerBinPath = path.resolve(__dirname, '../node_modules/.bin/analyze');
export const perfBudgetsReportDirName = 'perf-budgets-reports';
export const perfBudgetCombinedJsonReportName = 'perf-budgets-combined-report.json';
export const perfBudgetCombinedHtmlReportName = 'perf-budgets-combined-report.html';

export const jscpdBinPath = path.resolve(__dirname, '../node_modules/.bin/jscpd');
export const codeDupReportsRootDirName = 'code-duplication-reports';
export const codeDupCombinedJsonReportName = 'code-duplication-combined-report.json';
export const codeDupCombinedHtmlReportName = 'code-duplication-combined-report.html';

export const testsCoverageReportsRootDirName = 'tests-coverage-reports';
export const testsCoverageCombinedJsonReportName = 'tests-coverage-combined-report.json';
export const testsCoverageCombinedHtmlReportName = 'tests-coverage-combined-report.html';

export const tsTypesCoverageBin = path.resolve(
  __dirname,
  '../node_modules/.bin/typescript-coverage-report',
);
export const typesCoverageReportsRootDirName = 'types-coverage-reports';
export const typesCoverageCombinedJsonReportName = 'types-coverage-combined-report.json';
export const typesCoverageCombinedHtmlReportName = 'types-coverage-combined-report.html';
