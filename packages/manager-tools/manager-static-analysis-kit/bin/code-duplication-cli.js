#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  collectCodeDuplication,
  generateCodeDuplicationHtml,
} from '../dist/adapters/code-duplication/helpers/code-duplication-analysis-helper.js';
import { buildCodeDuplicationArgs, parseCliTargets } from './utils/args-parse-utils.js';
import { logError, logInfo, logWarn } from './utils/log-utils.js';
import { ensureBinExists, runAppsAnalysis, runCommand } from './utils/runner-utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');
const outputRootDir = path.resolve(__dirname, '../../../..');
const appsDir = path.join(rootDir, 'manager/apps');

const jscpdBin = path.resolve(__dirname, '../node_modules/.bin/jscpd');

// reports
const reportsRootDirName = 'code-duplication-reports';
const codeDupCombinedJsonReportName = 'code-duplication-combined-report.json';
const codeDupCombinedHtmlReportName = 'code-duplication-combined-report.html';

/**
 * Run `jscpd` code duplication analysis for a single app.
 *
 * @param {string} appDir - Absolute path to the app’s root directory.
 * @param {string} appShortName - Shortened app name (from package.json or folder).
 * @returns {boolean} True if analysis completed successfully, false otherwise.
 */
function runAppCodeDuplication(appDir, appShortName) {
  try {
    const absoluteOutputDir = path.join(outputRootDir, reportsRootDirName, appShortName);
    fs.mkdirSync(absoluteOutputDir, { recursive: true });

    // Relative output path from the app dir (keeps paths clean inside HTML reports)
    const relativeOutputDir = path.relative(appDir, absoluteOutputDir);

    logInfo(`Running jscpd for ${appShortName} → ${absoluteOutputDir}`);

    const args = [...buildCodeDuplicationArgs(relativeOutputDir), appDir];
    const ok = runCommand(jscpdBin, args, appDir);

    // Validate expected reports
    const jsonReport = path.join(absoluteOutputDir, 'jscpd-report.json');
    const htmlReport = path.join(absoluteOutputDir, 'html', 'index.html');

    if (!fs.existsSync(jsonReport)) {
      logWarn(`⚠️ Missing jscpd-report.json at ${jsonReport}`);
    }
    if (!fs.existsSync(htmlReport)) {
      logWarn(`⚠️ Missing html/index.html at ${htmlReport}`);
    }

    return ok;
  } catch (err) {
    logError(`Fatal error: ${err.stack || err.message}`);
    return false;
  }
}

/**
 * Main CLI entrypoint for code duplication analysis.
 *
 * - Ensures the `jscpd` binary is available
 * - Resolves target app folders from CLI args
 * - Runs per-app analysis via {@link runAppCodeDuplication}
 * - Generates combined JSON + HTML reports across all apps
 *
 * Exits process with code `1` if no apps were analyzed successfully
 * or if a fatal error occurred.
 */
function main() {
  try {
    ensureBinExists(jscpdBin, 'jscpd');

    const { appFolders } = parseCliTargets(appsDir);

    runAppsAnalysis({
      appsDir,
      appFolders,
      requireReact: true,
      binaryLabel: 'Code duplication',
      appRunner: runAppCodeDuplication,
      reportsRootDirName,
      combinedJson: codeDupCombinedJsonReportName,
      combinedHtml: codeDupCombinedHtmlReportName,
      collectFn: collectCodeDuplication,
      generateHtmlFn: generateCodeDuplicationHtml,
      outputRootDir,
    });
  } catch (err) {
    logError(`Fatal error: ${err.stack || err.message}`);
    process.exit(1);
  }
}

main();
