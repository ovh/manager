#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  collectTypesCoverage,
  generateTypesCoverageHtml,
} from '../dist/adapters/types-coverage/helpers/types-coverage-analysis-helper.js';
import { buildArgsFromConfig, parseCliTargets } from './utils/args-parse-utils.js';
import { isReactApp } from './utils/cli-utils.js';
import { logError, logInfo, logWarn } from './utils/log-utils.js';
import { generateCombinedReports } from './utils/reports-utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');
const outputRootDir = path.resolve(__dirname, '../../../..');
const appsDir = path.join(rootDir, 'manager/apps');

const tsCoverageBin = path.resolve(__dirname, '../node_modules/.bin/typescript-coverage-report');

const reportsRootDirName = 'types-coverage-reports';
const typesCoverageCombinedJsonReportName = 'types-coverage-combined-report.json';
const typesCoverageCombinedHtmlReportName = 'types-coverage-combined-report.html';

/**
 * Temporarily strip "extends" from tsconfig.json before analysis,
 * then restore it after.
 */
function patchTsConfig(appDir, fn) {
  const tsconfigPath = path.join(appDir, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    return fn();
  }

  const original = fs.readFileSync(tsconfigPath, 'utf-8');
  let parsed;
  try {
    parsed = JSON.parse(original);
  } catch {
    logWarn(`⚠️ Invalid tsconfig.json in ${appDir}, skipping patch`);
    return fn();
  }

  // Strip extends if present
  let modified = null;
  if (parsed.extends) {
    modified = { ...parsed };
    delete modified.extends;
    fs.writeFileSync(tsconfigPath, JSON.stringify(modified, null, 2));
    logInfo(`⏳ Patched tsconfig.json in ${appDir} (removed extends)`);
  }

  try {
    return fn();
  } finally {
    if (modified) {
      fs.writeFileSync(tsconfigPath, original);
      logInfo(`🔄 Restored tsconfig.json in ${appDir}`);
    }
  }
}

/**
 * Run type coverage report for a given app.
 */
function runAppTypesCoverage(appDir, appShortName) {
  try {
    return patchTsConfig(appDir, () => {
      const absoluteOutputDir = path.join(outputRootDir, reportsRootDirName, appShortName);
      fs.mkdirSync(absoluteOutputDir, { recursive: true });

      // Compute relative output path from appDir → avoids double-prefix bug
      const relativeOutputDir = path.relative(appDir, absoluteOutputDir);

      logInfo(`Running TypeScript coverage for ${appShortName} → ${absoluteOutputDir}`);

      const args = buildArgsFromConfig(relativeOutputDir);
      const analysisResult = spawnSync(tsCoverageBin, args, {
        cwd: appDir,
        stdio: 'inherit',
        shell: true,
      });

      const jsonReport = path.join(absoluteOutputDir, 'typescript-coverage.json');
      const htmlReport = path.join(absoluteOutputDir, 'index.html');

      if (!fs.existsSync(jsonReport)) {
        logWarn(`⚠️ Missing typescript-coverage.json at ${jsonReport}`);
      }
      if (!fs.existsSync(htmlReport)) {
        logWarn(`⚠️ Missing index.html at ${htmlReport}`);
      }

      return analysisResult.status === 0;
    });
  } catch (err) {
    logError(`Fatal error: ${err.stack || err.message}`);
    return false;
  }
}

/**
 * Analyze all target apps with type coverage.
 */
function runAppsTypesCoverage(appFolders) {
  const analyzed = [];

  for (const appFolder of appFolders) {
    try {
      const appDir = path.join(appsDir, appFolder);
      if (!fs.existsSync(appDir)) {
        logError(`❌ App folder not found: ${appFolder} → skipping`);
        continue;
      }

      const pkgPath = path.join(appDir, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        logWarn(`⚠️ No package.json for ${appFolder}, skipping`);
        continue;
      }
      if (!isReactApp(pkgPath)) {
        logWarn(`⚠️ ${appFolder} is not a React app, skipping`);
        continue;
      }

      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const appShortName = pkg.name.replace(/^@ovh-ux\//, '');

      const ok = runAppTypesCoverage(appDir, appShortName);
      if (ok) analyzed.push(appShortName);
    } catch (err) {
      logError(`❌ Failed to analyze ${appFolder}: ${err.message}`);
    }
  }

  return analyzed;
}

/**
 * Main CLI entrypoint for TypeScript coverage tests.
 */
function main() {
  try {
    if (!fs.existsSync(tsCoverageBin)) {
      logError(`❌ typescript-coverage-report binary not found at ${tsCoverageBin}`);
      return;
    }

    const { appFolders } = parseCliTargets(appsDir);

    // Step 1: run type coverage
    const analyzedApps = runAppsTypesCoverage(appFolders);

    // Step 2: combined reports
    if (analyzedApps.length > 0) {
      generateCombinedReports(
        path.join(outputRootDir, reportsRootDirName),
        typesCoverageCombinedJsonReportName,
        typesCoverageCombinedHtmlReportName,
        collectTypesCoverage,
        generateTypesCoverageHtml,
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
