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
import { isReactApp, logError, logInfo, logWarn } from './cli-utils.js';

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
function runAnalyzer(appDir, appShort, mode) {
  const reportFile = `${bundleAnalysisConfig?.reportFile || 'bundle-report'}${
    mode === 'json' ? '.json' : '.html'
  }`;
  const outputDir = path.join(outputRootDir, perfBudgetsReportDirName, appShort);
  fs.mkdirSync(outputDir, { recursive: true });

  logInfo(`Running bundle analyzer (${mode}) for ${appShort} → ${outputDir}`);

  const analyzerArgs = [
    '--mode',
    mode,
    '--no-open',
    '--filename',
    bundleAnalysisConfig?.reportFile || 'bundle-report',
  ];

  const result = spawnSync(bundleAnalyzerBin, analyzerArgs, {
    cwd: appDir,
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    logError(`Analyzer (${mode}) failed for ${appShort}`);
    return;
  }

  const distReport = path.join(appDir, 'dist', reportFile);
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
 * Build all selected apps with Turbo in one go.
 */
function buildApps(apps) {
  const filters = apps.map((d) => {
    const pkg = JSON.parse(fs.readFileSync(path.join(appsDir, d, 'package.json'), 'utf-8'));
    return pkg.name;
  });

  const turboArgs = ['run', 'build', ...filters.flatMap((f) => ['--filter', f])];
  logInfo(`Building apps with Turbo (filters: ${filters.join(', ')})`);

  const buildResult = spawnSync('turbo', turboArgs, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  if (buildResult.status !== 0) {
    logError('Turbo build failed for one or more apps. Aborting analysis.');
    process.exit(1);
  }
}

/**
 * Analyze apps (assumes build is already done).
 */
function analyzeApps(apps) {
  const analyzed = [];
  for (const app of apps) {
    const appDir = path.join(appsDir, app);
    const pkg = JSON.parse(fs.readFileSync(path.join(appDir, 'package.json'), 'utf-8'));
    const appName = pkg.name;
    const appShort = appName.replace(/^@ovh-ux\//, '');

    runAnalyzer(appDir, appShort, 'static');
    runAnalyzer(appDir, appShort, 'json');

    analyzed.push(appName);
  }
  return analyzed;
}

/**
 * Remove old combined perf budget reports before regeneration.
 */
function cleanOldCombinedReports() {
  const combinedJsonFilePath = path.join(
    outputRootDir,
    perfBudgetsReportDirName,
    perfBudgetCombinedJsonReportName,
  );
  const combinedHtmlFilePath = path.join(
    outputRootDir,
    perfBudgetsReportDirName,
    perfBudgetCombinedHtmlReportName,
  );

  [combinedJsonFilePath, combinedHtmlFilePath].forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      logInfo(`🗑️ Removed old report: ${file}`);
    }
  });
}

/**
 * Collect budgets and regenerate combined reports.
 */
function generateCombinedReports(root) {
  cleanOldCombinedReports();

  const summary = collectPerfBudgets(root);

  const combinedJsonFilePath = path.join(
    root,
    perfBudgetsReportDirName,
    perfBudgetCombinedJsonReportName,
  );
  fs.writeFileSync(combinedJsonFilePath, JSON.stringify(summary, null, 2));
  logInfo(`✅ Combined JSON report written to ${combinedJsonFilePath}`);

  const combinedHtmlFilePath = path.join(
    root,
    perfBudgetsReportDirName,
    perfBudgetCombinedHtmlReportName,
  );
  fs.writeFileSync(combinedHtmlFilePath, generatePerfBudgetsHtml(summary));
  logInfo(`✅ Combined HTML report written to ${combinedHtmlFilePath}`);
}

/**
 * Main CLI entrypoint.
 */
function main() {
  try {
    if (!fs.existsSync(bundleAnalyzerBin)) {
      logError(`Analyzer binary not found at ${bundleAnalyzerBin}`);
      return;
    }

    // CLI options: --app <name>
    const appArgIndex = process.argv.indexOf('--app');
    let selectedApps = [];

    if (appArgIndex !== -1 && process.argv[appArgIndex + 1]) {
      const appName = process.argv[appArgIndex + 1];
      if (!fs.existsSync(path.join(appsDir, appName))) {
        logError(`App not found: ${appName}`);
        process.exit(1);
      }
      selectedApps = [appName];
      logInfo(`Running in single-app mode for ${appName}`);
    } else {
      // discover all React apps
      selectedApps = fs
        .readdirSync(appsDir)
        .filter((directory) => {
          const pkgPath = path.join(appsDir, directory, 'package.json');
          return fs.existsSync(pkgPath) && isReactApp(pkgPath);
        })
        .slice(0, 3);

      if (selectedApps.length === 0) {
        logWarn('No React apps found to analyze.');
        return;
      }
      logInfo(`Running in multi-app mode (${selectedApps.length} apps).`);
    }

    // Step 1: build selected apps
    buildApps(selectedApps);

    // Step 2: analyze apps
    const analyzedApps = analyzeApps(selectedApps);

    // Step 3: generate combined reports
    if (analyzedApps.length > 0) {
      generateCombinedReports(outputRootDir);
    }
  } catch (err) {
    logError(`Fatal error: ${err.stack || err.message}`);
    process.exit(1);
  }
}

main();
