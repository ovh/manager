#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  collectTypesCoverage,
  generateTypesCoverageHtml,
} from '../dist/adapters/types-coverage/helpers/types-coverage-analysis-helper.js';
import { buildTypesCoverageArgs, parseCliTargets } from './utils/args-parse-utils.js';
import { logError, logInfo, logWarn } from './utils/log-utils.js';
import { ensureBinExists, runAppsAnalysis, runCommand } from './utils/runner-utils.js';

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
 *
 * @param {string} appDir - Absolute app directory
 * @param {() => boolean} fn - Callback running the analysis
 * @returns {boolean} Result of the callback
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
 * Run TypeScript coverage for one app.
 *
 * @param {string} appDir - Absolute app directory
 * @param {string} appShortName - Shortened app name
 * @returns {boolean} True if analysis completed successfully
 */
function runAppTypesCoverage(appDir, appShortName) {
  return patchTsConfig(appDir, () => {
    const absoluteOutputDir = path.join(outputRootDir, reportsRootDirName, appShortName);
    fs.mkdirSync(absoluteOutputDir, { recursive: true });

    const relativeOutputDir = path.relative(appDir, absoluteOutputDir);
    logInfo(`Running TypeScript coverage for ${appShortName} → ${absoluteOutputDir}`);

    const args = buildTypesCoverageArgs(relativeOutputDir);
    const ok = runCommand(tsCoverageBin, args, appDir);

    const jsonReport = path.join(absoluteOutputDir, 'typescript-coverage.json');
    const htmlReport = path.join(absoluteOutputDir, 'index.html');

    if (!fs.existsSync(jsonReport)) {
      logWarn(`⚠️ Missing typescript-coverage.json at ${jsonReport}`);
    }
    if (!fs.existsSync(htmlReport)) {
      logWarn(`⚠️ Missing index.html at ${htmlReport}`);
    }

    return ok;
  });
}

/**
 * Main CLI entrypoint for TypeScript coverage analysis.
 */
function main() {
  try {
    ensureBinExists(tsCoverageBin, 'typescript-coverage-report');

    const { appFolders } = parseCliTargets(appsDir);

    runAppsAnalysis({
      appsDir,
      appFolders,
      requireReact: true,
      binaryLabel: 'Type coverage',
      appRunner: runAppTypesCoverage,
      reportsRootDirName,
      combinedJson: typesCoverageCombinedJsonReportName,
      combinedHtml: typesCoverageCombinedHtmlReportName,
      collectFn: collectTypesCoverage,
      generateHtmlFn: generateTypesCoverageHtml,
      outputRootDir,
    });
  } catch (err) {
    logError(`Fatal error: ${err.stack || err.message}`);
    process.exit(1);
  }
}

main();
