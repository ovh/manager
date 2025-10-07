#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import {
  collectTestsCoverage,
  generateTestsCoverageHtml,
} from '../dist/adapters/tests-coverage/helpers/tests-coverage-analysis-helper.js';
import {
  rootDir,
  testsCoverageCombinedHtmlReportName,
  testsCoverageCombinedJsonReportName,
  testsCoverageOutputRootDir,
  testsCoverageReportsRootDirName,
} from './cli-path-config.js';
import { parseCliTargets } from './utils/args-parse-utils.js';
import { logError, logInfo, logWarn } from './utils/log-utils.js';
import { runModulesAnalysis } from './utils/runner-utils.js';
import { runTurboBuild, runTurboTests } from './utils/turbo-utils.js';

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
  const outDir = path.join(
    testsCoverageOutputRootDir,
    testsCoverageReportsRootDirName,
    appShortName,
  );
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
    const modules = parseCliTargets();

    // 1) Build all selected targets (best-effort)
    runTurboBuild(
      rootDir,
      modules.map((item) => item.packageName),
      ['--continue'],
    );

    // 2) Run tests with coverage; keep args minimal for Vitest/Jest compatibility
    //    (Projects should already be configured to emit json-summary/lcov.)
    runTurboTests(
      rootDir,
      modules.map((item) => item.packageName),
      [
        '--continue', // turbo: keep going even if some tests fail
        '--', // pass the rest to the test runner
        '--coverage',
        '--coverage.reportOnFailure',
        '--coverage.reporter',
        'json-summary',
        '--coverage.reporter',
        'lcov',
        '--coverage.reporter',
        'html',
      ],
    );

    // 3) Per-app harvest + combined reports
    runModulesAnalysis({
      modules,
      binaryLabel: 'Tests coverage',
      analysisRunner: harvestAppCoverage,
      reportsRootDirName: testsCoverageReportsRootDirName,
      combinedJson: testsCoverageCombinedJsonReportName,
      combinedHtml: testsCoverageCombinedHtmlReportName,
      collectFn: collectTestsCoverage,
      generateHtmlFn: (combined) =>
        generateTestsCoverageHtml(
          combined,
          path.join(testsCoverageOutputRootDir, testsCoverageReportsRootDirName),
        ),
      outputRootDir: testsCoverageOutputRootDir,
    });
  } catch (err) {
    logError(`Fatal error: ${err.stack || err.message}`);
    process.exit(1);
  }
}

main();
