import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const rootDir = path.resolve(__dirname, '../../..');

export const appsDir = path.join('.', 'packages/manager/apps');

export const librariesBasePaths = [
  path.join('.', 'packages/manager/core'),
  path.join('.', 'packages/manager/modules'),
  path.join('.', 'packages/components'),
];

export const bundleAnalyzerBinPath = path.resolve(__dirname, '../node_modules/.bin/analyze');
export const perfBudgetsReportDirName = 'perf-budgets-reports';
export const perfBudgetCombinedJsonReportName = 'perf-budgets-combined-report.json';
export const perfBudgetCombinedHtmlReportName = 'perf-budgets-combined-report.html';
export const perfBudgetOutputRootDir = path.resolve(
  __dirname,
  '../../../../static-dynamic-quality-reports',
);

export const jscpdBinPath = path.resolve(__dirname, '../node_modules/.bin/jscpd');
export const codeDupReportsRootDirName = 'code-duplication-reports';
export const codeDupCombinedJsonReportName = 'code-duplication-combined-report.json';
export const codeDupCombinedHtmlReportName = 'code-duplication-combined-report.html';
export const codeDupOutputRootDir = path.resolve(
  __dirname,
  '../../../../static-dynamic-quality-reports',
);

export const testsCoverageReportsRootDirName = 'tests-coverage-reports';
export const testsCoverageCombinedJsonReportName = 'tests-coverage-combined-report.json';
export const testsCoverageCombinedHtmlReportName = 'tests-coverage-combined-report.html';
export const testsCoverageOutputRootDir = path.resolve(
  __dirname,
  '../../../../static-dynamic-quality-reports',
);

export const tsTypesCoverageBin = path.resolve(
  __dirname,
  '../node_modules/.bin/typescript-coverage-report',
);
export const typesCoverageReportsRootDirName = 'types-coverage-reports';
export const typesCoverageCombinedJsonReportName = 'types-coverage-combined-report.json';
export const typesCoverageCombinedHtmlReportName = 'types-coverage-combined-report.html';
export const typesCoverageOutputRootDir = path.resolve(
  __dirname,
  '../../../../static-dynamic-quality-reports',
);

export const combinedReportOutputRootDir = path.resolve(
  __dirname,
  '../../../../static-dynamic-quality-reports',
);

export const staticDiscoveredLibraries = [
  {
    fullPath: 'packages/manager-react-components',
    shortPath: 'manager-react-components',
    packageName: '@ovh-ux/manager-react-components',
  },
  {
    fullPath: 'packages/manager-wiki',
    shortPath: 'manager-wiki',
    packageName: '@ovh-ux/manager-wiki',
  },
];
