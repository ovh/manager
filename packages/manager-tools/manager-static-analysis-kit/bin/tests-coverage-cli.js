#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import {
  collectTestsCoverage,
  generateTestsCoverageHtml,
} from '../dist/adapters/tests-coverage/helpers/tests-coverage-analysis-helper.js';
import {
  appsDir,
  outputRootDir,
  rootDir,
  testsCoverageCombinedHtmlReportName,
  testsCoverageCombinedJsonReportName,
  testsCoverageReportsRootDirName,
} from './cli-path-config.js';
import { parseCliTargets } from './utils/args-parse-utils.js';
import { logError, logInfo, logWarn } from './utils/log-utils.js';
import { runAppsAnalysis } from './utils/runner-utils.js';
import { resolveTurboFilters, runTurboBuild, runTurboTests } from './utils/turbo-utils.js';

/**
 * Locate common coverage artifacts inside an app directory.
 * @param {string} appDir
 * @returns {{ summary: string | null, lcov: string | null }}
 */
function findCoverageFiles(appDir) {
  const candidates = [
    // Vitest & Jest default
    path.join(appDir, 'coverage', 'coverage-summary.json'),
    // Sometimes coverage is nested (e.g., project subdir)
    // We’ll scan one level deep for coverage-summary.json
  ];

  let summary = candidates.find((p) => fs.existsSync(p));
  if (!summary) {
    // one-level deep scan
    for (const entry of fs.readdirSync(appDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (['node_modules', 'dist', 'build', '.next', 'coverage'].includes(entry.name)) continue;
      const p = path.join(appDir, entry.name, 'coverage', 'coverage-summary.json');
      if (fs.existsSync(p)) {
        summary = p;
        break;
      }
    }
  }

  // Best-effort extras (not mandatory)
  const lcov =
    (summary && path.join(path.dirname(summary), 'lcov.info')) ||
    path.join(appDir, 'coverage', 'lcov.info');

  return { summary, lcov: fs.existsSync(lcov) ? lcov : null };
}

/**
 * Copy an app’s coverage files into tests-coverage-reports/<app>.
 * @param {string} appDir
 * @param {string} appShortName
 * @returns {boolean} True if a summary was found and copied
 */
function harvestAppCoverage(appDir, appShortName) {
  const { summary, lcov } = findCoverageFiles(appDir);
  const outDir = path.join(outputRootDir, testsCoverageReportsRootDirName, appShortName);
  fs.mkdirSync(outDir, { recursive: true });

  if (!summary) {
    logWarn(`⚠️  No coverage-summary.json found for ${appShortName}`);
    return false;
  }

  const targetSummary = path.join(outDir, 'coverage-summary.json');
  fs.copyFileSync(summary, targetSummary);
  logInfo(`✅ Copied summary → ${targetSummary}`);

  if (lcov) {
    const targetLcov = path.join(outDir, 'lcov.info');
    fs.copyFileSync(lcov, targetLcov);
    logInfo(`✅ Copied lcov → ${targetLcov}`);
  }

  return true;
}

/**
 * Main CLI entrypoint: build → test (with coverage) → harvest → combine.
 */
function main() {
  try {
    const { appFolders, packageNames } = parseCliTargets(appsDir);
    const turboFilters = resolveTurboFilters({ appsDir, appFolders, packageNames });

    // 1) Build all selected targets (best-effort)
    runTurboBuild(rootDir, turboFilters);

    // 2) Run tests with coverage; keep args minimal for Vitest/Jest compatibility
    //    (Projects should already be configured to emit json-summary/lcov.)
    runTurboTests(rootDir, turboFilters, [
      '--',
      '--coverage',
      '--coverage.reporter',
      'json-summary',
      '--coverage.reporter',
      'lcov',
      '--coverage.reporter',
      'html',
    ]);

    // 3) Per-app harvest + combined reports
    runAppsAnalysis({
      appsDir,
      appFolders,
      requireReact: false,
      binaryLabel: 'Tests coverage',
      appRunner: harvestAppCoverage,
      reportsRootDirName: testsCoverageReportsRootDirName,
      combinedJson: testsCoverageCombinedJsonReportName,
      combinedHtml: testsCoverageCombinedHtmlReportName,
      collectFn: collectTestsCoverage,
      generateHtmlFn: (combined) =>
        generateTestsCoverageHtml(
          combined,
          path.join(outputRootDir, testsCoverageReportsRootDirName),
        ),
      outputRootDir,
    });
  } catch (err) {
    logError(`Fatal error: ${err.stack || err.message}`);
    process.exit(1);
  }
}

main();
