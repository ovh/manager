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

// Shared packages that must always be built
const sharedPackages = [
  {
    name: '@ovh-ux/manager-react-components',
    folder: 'manager-react-components',
    path: path.join(rootDir, 'packages/manager-react-components'),
  },
];

/**
 * Run vite-bundle-analyzer for given mode (html or json).
 */
function runBundleAnalyzer(appDirectory, appShortName, mode) {
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
 * Build selected targets with Turbo.
 */
function runTurboBuild(filters) {
  if (filters.length === 0) {
    logWarn('⚠️ No Turbo build filters provided, skipping build step.');
    return;
  }

  const turboArgs = ['run', 'build', ...filters.flatMap((pkgName) => ['--filter', pkgName])];
  logInfo(`Building with Turbo (filters: ${filters.join(', ')})`);

  const buildResult = spawnSync('turbo', turboArgs, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  if (buildResult.status !== 0) {
    logWarn('⚠️ Turbo build failed for one or more targets. Will still try to analyze apps.');
  }
}

/**
 * Analyze all given app folders.
 */
function analyzeAppFolders(appFolders) {
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

      runBundleAnalyzer(appDir, appShortName, 'static');
      runBundleAnalyzer(appDir, appShortName, 'json');

      analyzed.push(appName);
    } catch (err) {
      logError(`❌ Failed to analyze ${appFolder}: ${err.message}`);
    }
  }
  return analyzed;
}

/**
 * Remove old combined perf budget reports.
 */
function removeOldCombinedReports() {
  const combinedJsonPath = path.join(
    outputRootDir,
    perfBudgetsReportDirName,
    perfBudgetCombinedJsonReportName,
  );
  const combinedHtmlPath = path.join(
    outputRootDir,
    perfBudgetsReportDirName,
    perfBudgetCombinedHtmlReportName,
  );

  [combinedJsonPath, combinedHtmlPath].forEach((file) => {
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
  removeOldCombinedReports();

  const summary = collectPerfBudgets(root);

  const combinedJsonPath = path.join(
    root,
    perfBudgetsReportDirName,
    perfBudgetCombinedJsonReportName,
  );
  fs.writeFileSync(combinedJsonPath, JSON.stringify(summary, null, 2));
  logInfo(`✅ Combined JSON report written to ${combinedJsonPath}`);

  const combinedHtmlPath = path.join(
    root,
    perfBudgetsReportDirName,
    perfBudgetCombinedHtmlReportName,
  );
  fs.writeFileSync(combinedHtmlPath, generatePerfBudgetsHtml(summary));
  logInfo(`✅ Combined HTML report written to ${combinedHtmlPath}`);
}

/**
 * Guess app folder name from package name.
 * Example: @ovh-ux/manager-zimbra-app -> zimbra
 */
function extractAppFolderFromPackageName(packageName) {
  const match = packageName.match(/^@ovh-ux\/manager-(.+)-app$/);
  if (!match) {
    logError(`❌ Invalid package name format: ${packageName}`);
    return null;
  }
  return match[1];
}

/**
 * Convert app folders to Turbo filters (package names).
 */
function resolveTurboFiltersFromAppFolders(appFolders) {
  return appFolders
    .map((appFolder) => {
      const pkgPath = path.join(appsDir, appFolder, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        logError(`❌ No package.json for app folder ${appFolder}, skipping`);
        return null;
      }
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      return pkg.name;
    })
    .filter(Boolean);
}

/**
 * Parse CLI arguments for `--apps` or `--app` flags.
 *
 * @returns {{appFolders: string[], packageNames: string[]} | null}
 *   An object with valid app folder names and an empty packageNames array,
 *   or null if the flag is not present.
 */
function parseAppsArg() {
  const appsArg = process.argv.find((arg) => arg === '--apps' || arg === '--app');
  if (!appsArg) return null;

  const index = process.argv.indexOf(appsArg);
  const rawValue = process.argv[index + 1] || '';
  const appFolders = rawValue
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);

  const validFolders = appFolders.filter((folder) => {
    if (!fs.existsSync(path.join(appsDir, folder))) {
      logError(`❌ App not found: ${folder} → skipping`);
      return false;
    }
    return true;
  });

  logInfo(`Running in apps mode for: ${validFolders.join(', ')}`);
  return { appFolders: validFolders, packageNames: [] };
}

/**
 * Parse CLI arguments for `--packages` or `--package` flags.
 *
 * @returns {{appFolders: string[], packageNames: string[]} | null}
 *   An object mapping package names to their corresponding app folders,
 *   or null if the flag is not present.
 */
function parsePackagesArg() {
  const packagesArg = process.argv.find((arg) => arg === '--packages' || arg === '--package');
  if (!packagesArg) return null;

  const index = process.argv.indexOf(packagesArg);
  const rawValue = process.argv[index + 1] || '';
  const packageNames = rawValue
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);

  const mappedFolders = [];
  for (const pkgName of packageNames) {
    const folder = extractAppFolderFromPackageName(pkgName);
    if (folder && fs.existsSync(path.join(appsDir, folder))) {
      mappedFolders.push(folder);
    } else {
      logError(`❌ Package ${pkgName} → app folder ${folder} not found, skipping`);
    }
  }

  logInfo(
    `Running in packages mode for: ${packageNames.join(', ')} → apps: ${mappedFolders.join(', ')}`,
  );
  return { appFolders: mappedFolders, packageNames };
}

/**
 * Discover all React apps automatically when no CLI flags are provided.
 *
 * @returns {{appFolders: string[], packageNames: string[]}}
 *   An object containing discovered React app folders and an empty packageNames array.
 */
function discoverApps() {
  const discoveredAppFolders = fs.readdirSync(appsDir).filter((dir) => {
    const pkgPath = path.join(appsDir, dir, 'package.json');
    return fs.existsSync(pkgPath) && isReactApp(pkgPath);
  });

  if (discoveredAppFolders.length === 0) {
    logWarn('⚠️ No React apps found to analyze.');
    return { appFolders: [], packageNames: [] };
  }

  logInfo(`Running in auto-discovery mode (${discoveredAppFolders.length} apps).`);
  return { appFolders: discoveredAppFolders, packageNames: [] };
}

/**
 * Parse CLI arguments to resolve which apps or packages should be analyzed.
 *
 * Priority:
 *  1. Explicit `--apps`
 *  2. Explicit `--packages`
 *  3. Auto-discovery fallback
 *
 * @returns {{appFolders: string[], packageNames: string[]}}
 *   Object containing app folder names and package names for analysis.
 */
function parseCliTargets() {
  return parseAppsArg() || parsePackagesArg() || discoverApps();
}

/**
 * Resolve Turbo filters (package names) depending on mode.
 */
function resolveTurboFilters({ appFolders, packageNames }) {
  let filters = [];
  if (appFolders.length > 0 && packageNames.length === 0) {
    filters = resolveTurboFiltersFromAppFolders(appFolders);
  } else if (packageNames.length > 0) {
    filters = packageNames;
  }

  // Always include shared packages for build
  for (const pkg of sharedPackages) {
    if (fs.existsSync(pkg.path) && !filters.includes(pkg.name)) {
      filters.push(pkg.name);
      logInfo(`Including shared dependency in build: ${pkg.name}`);
    }
  }

  return filters;
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

    const { appFolders, packageNames } = parseCliTargets();
    const turboFilters = resolveTurboFilters({ appFolders, packageNames });

    // Step 1: build
    runTurboBuild(turboFilters);

    // Step 2: analyze
    const analyzedApps = analyzeAppFolders(appFolders);

    // Step 3: combined reports
    if (analyzedApps.length > 0) {
      generateCombinedReports(outputRootDir);
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
