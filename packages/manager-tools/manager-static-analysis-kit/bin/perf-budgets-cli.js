#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import {
  collectPerfBudgets,
  generatePerfBudgetsHtml,
} from '../dist/adapters/perf-budgets/helpers/perfs-bundle-analysis-helper.js';
import { bundleAnalysisConfig } from '../dist/configs/bundle-analysis-config.js';
import {
  appsDir,
  bundleAnalyzerBinPath,
  outputRootDir,
  perfBudgetCombinedHtmlReportName,
  perfBudgetCombinedJsonReportName,
  perfBudgetsReportDirName,
  rootDir,
} from './cli-path-config.js';
import { parseCliTargets } from './utils/args-parse-utils.js';
import { logError, logInfo, logWarn } from './utils/log-utils.js';
import { ensureBinExists, runAppsAnalysis, runCommand } from './utils/runner-utils.js';
import { resolveTurboFilters, runTurboBuild } from './utils/turbo-utils.js';

/**
 * Run vite-bundle-analyzer for a given mode (html or json).
 *
 * @param {string} appDir - Absolute app directory
 * @param {string} appShortName - Shortened app name
 * @param {"static"|"json"} mode - Analyzer mode
 * @returns {boolean} True if analyzer produced output, false otherwise
 */
function runAppBundleAnalyzer(appDir, appShortName, mode) {
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

  const ok = runCommand(bundleAnalyzerBinPath, analyzerArgs, appDir);
  if (!ok) {
    logError(`❌ Analyzer (${mode}) failed for ${appShortName}`);
    return false;
  }

  const distReport = path.join(appDir, 'dist', reportFile);
  const targetReport = path.join(outputDir, reportFile);

  if (fs.existsSync(distReport)) {
    fs.copyFileSync(distReport, targetReport);
    logInfo(`✅ ${mode.toUpperCase()} report copied to ${targetReport}`);
    return true;
  } else {
    logWarn(`⚠️ Expected ${mode} report not found at ${distReport}`);
    return false;
  }
}

/**
 * Run perf budgets analysis for one app (both static + json).
 *
 * @param {string} appDir
 * @param {string} appShortName
 * @returns {boolean} True if at least one report succeeded
 */
function runAppPerfBudgets(appDir, appShortName) {
  const okStatic = runAppBundleAnalyzer(appDir, appShortName, 'static');
  const okJson = runAppBundleAnalyzer(appDir, appShortName, 'json');
  return okStatic || okJson;
}

/**
 * Main CLI entrypoint for perf budgets analysis.
 *
 * - Ensures analyzer binary is available
 * - Runs a turbo build for the selected apps
 * - Executes analyzer per app via {@link runAppPerfBudgets}
 * - Generates combined JSON + HTML reports
 */
function main() {
  try {
    ensureBinExists(bundleAnalyzerBinPath, 'vite-bundle-analyzer');

    const { appFolders, packageNames } = parseCliTargets(appsDir);
    const turboFilters = resolveTurboFilters({ appsDir, appFolders, packageNames });

    // Step 1: build
    runTurboBuild(rootDir, turboFilters);

    // Step 2: analyze apps + combined
    runAppsAnalysis({
      appsDir,
      appFolders,
      requireReact: false,
      binaryLabel: 'Perf budgets',
      appRunner: runAppPerfBudgets,
      reportsRootDirName: perfBudgetsReportDirName,
      combinedJson: perfBudgetCombinedJsonReportName,
      combinedHtml: perfBudgetCombinedHtmlReportName,
      collectFn: collectPerfBudgets,
      generateHtmlFn: generatePerfBudgetsHtml,
      outputRootDir,
    });
  } catch (err) {
    logError(`Fatal error: ${err.stack || err.message}`);
    process.exit(1);
  }
}

main();
