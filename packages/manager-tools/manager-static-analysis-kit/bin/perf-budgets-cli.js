#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  collectPerfBudgets,
  generatePerfBudgetsHtml,
} from '../dist/adapters/perf-budgets/helpers/perfs-bundle-analysis-helper.js';
import { bundleAnalysisConfig } from '../dist/configs/bundle-analysis-config.js';
import { parseCliTargets } from './utils/args-parse-utils.js';
import { logError, logInfo, logWarn } from './utils/log-utils.js';
import { generateCombinedReports } from './utils/reports-utils.js';
import { resolveTurboFilters, runTurboBuild } from './utils/turbo-utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');
const outputRootDir = path.resolve(__dirname, '../../../..');
const appsDir = path.join(rootDir, 'manager/apps');
const bundleAnalyzerBin = path.resolve(__dirname, '../node_modules/.bin/analyze');
const perfBudgetsReportDirName = 'perf-budgets-reports';
const perfBudgetCombinedJsonReportName = 'perf-budgets-combined-report.json';
const perfBudgetCombinedHtmlReportName = 'perf-budgets-combined-report.html';

/**
 * Run vite-bundle-analyzer for given mode (html or json).
 */
function runAppBundleAnalyzer(appDirectory, appShortName, mode) {
  const reportFile = `${bundleAnalysisConfig?.reportFile || 'bundle-report'}${
    mode === 'json' ? '.json' : '.html'
  }`;
  const outputDir = path.join(outputRootDir, perfBudgetsReportDirName, appShortName);
  fs.mkdirSync(outputDir, { recursive: true });

  logInfo(`Running bundle analyzer (${mode}) for ${appShortName} → ${outputDir}`);

  const analyzerArgs = [
    '--mode',
    mode,
    '--no-open',
    '--filename',
    bundleAnalysisConfig?.reportFile || 'bundle-report',
  ];

  const result = spawnSync(bundleAnalyzerBin, analyzerArgs, {
    cwd: appDirectory,
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    logError(`❌ Analyzer (${mode}) failed for ${appShortName}`);
    return;
  }

  const distReport = path.join(appDirectory, 'dist', reportFile);
  const targetReport = path.join(outputDir, reportFile);

  if (fs.existsSync(distReport)) {
    fs.copyFileSync(distReport, targetReport);
    logInfo(`✅ ${mode.toUpperCase()} report copied to ${targetReport}`);
    return targetReport;
  } else {
    logWarn(`⚠️ Expected ${mode} report not found at ${distReport}`);
  }
}

/**
 * Analyze all given app folders.
 */
function runAppsBundleAnalyzer(appFolders) {
  const analyzed = [];
  for (const appFolder of appFolders) {
    try {
      const appDir = path.join(appsDir, appFolder);
      if (!fs.existsSync(appDir)) {
        logError(`❌ App folder not found: ${appFolder} → skipping`);
        continue;
      }

      const pkg = JSON.parse(fs.readFileSync(path.join(appDir, 'package.json'), 'utf-8'));
      const appName = pkg.name;
      const appShortName = appName.replace(/^@ovh-ux\//, '');

      runAppBundleAnalyzer(appDir, appShortName, 'static');
      runAppBundleAnalyzer(appDir, appShortName, 'json');

      analyzed.push(appName);
    } catch (err) {
      logError(`❌ Failed to analyze ${appFolder}: ${err.message}`);
    }
  }
  return analyzed;
}

/**
 * Main CLI entrypoint.
 */
function main() {
  try {
    if (!fs.existsSync(bundleAnalyzerBin)) {
      logError(`❌ Analyzer binary not found at ${bundleAnalyzerBin}`);
      return;
    }

    const { appFolders, packageNames } = parseCliTargets(appsDir);
    const turboFilters = resolveTurboFilters({ appsDir, appFolders, packageNames });

    // Step 1: build
    runTurboBuild(rootDir, turboFilters);

    // Step 2: analyze
    const analyzedApps = runAppsBundleAnalyzer(appFolders);

    // Step 3: combined reports
    if (analyzedApps.length > 0) {
      generateCombinedReports(
        path.join(outputRootDir, perfBudgetsReportDirName),
        perfBudgetCombinedJsonReportName,
        perfBudgetCombinedHtmlReportName,
        collectPerfBudgets,
        generatePerfBudgetsHtml,
      );
    } else {
      logError('❌ No apps successfully analyzed. Exiting.');
      process.exit(1);
    }
  } catch (err) {
    logError(`Fatal error: ${err.stack || err.message}`);
    process.exit(1);
  }
}

main();
