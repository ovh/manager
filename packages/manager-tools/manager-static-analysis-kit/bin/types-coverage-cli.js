#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

import {
  collectTypesCoverage,
  generateTypesCoverageHtml,
} from '../dist/adapters/types-coverage/helpers/types-coverage-analysis-helper.js';
import {
  appsDir,
  outputRootDir,
  tsTypesCoverageBin,
  typesCoverageCombinedHtmlReportName,
  typesCoverageCombinedJsonReportName,
  typesCoverageReportsRootDirName,
} from './cli-path-config.js';
import { buildTypesCoverageArgs, parseCliTargets } from './utils/args-parse-utils.js';
import { logError, logInfo, logWarn } from './utils/log-utils.js';
import { ensureBinExists, runAppsAnalysis, runCommand } from './utils/runner-utils.js';

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
 * Count loose TypeScript constructs (`as`, `any`, `unknown`) in src/.
 *
 * Uses the TypeScript compiler API to avoid false positives from strings, comments, etc.
 *
 * @param {string} appDir Absolute path to app root
 * @returns {{ as: number; any: number; unknown: number }}
 */
export function countLooseTypes(appDir) {
  const srcDir = path.join(appDir, 'src');
  let asCount = 0;
  let anyCount = 0;
  let unknownCount = 0;

  function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const source = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

    function visit(node) {
      // "as" expressions: foo as string
      if (ts.isAsExpression(node)) {
        asCount++;
        if (node.type.kind === ts.SyntaxKind.AnyKeyword) {
          anyCount++;
        } else if (node.type.kind === ts.SyntaxKind.UnknownKeyword) {
          unknownCount++;
        }
      }

      // Type annotations like let x: any or function foo(x: unknown)
      if (node.kind === ts.SyntaxKind.AnyKeyword) {
        anyCount++;
      } else if (node.kind === ts.SyntaxKind.UnknownKeyword) {
        unknownCount++;
      }

      ts.forEachChild(node, visit);
    }

    visit(source);
  }

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        analyzeFile(fullPath);
      }
    }
  }

  if (fs.existsSync(srcDir)) {
    walk(srcDir);
  }

  return { as: asCount, any: anyCount, unknown: unknownCount };
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
    const absoluteOutputDir = path.join(
      outputRootDir,
      typesCoverageReportsRootDirName,
      appShortName,
    );
    fs.mkdirSync(absoluteOutputDir, { recursive: true });

    const relativeOutputDir = path.relative(appDir, absoluteOutputDir);
    logInfo(`Running TypeScript coverage for ${appShortName} → ${absoluteOutputDir}`);

    const args = buildTypesCoverageArgs(relativeOutputDir);
    const ok = runCommand(tsTypesCoverageBin, args, appDir);

    const looseTypes = countLooseTypes(appDir);
    const looseTypeReport = path.join(absoluteOutputDir, 'loose-types.json');
    fs.writeFileSync(looseTypeReport, JSON.stringify(looseTypes, null, 2));

    const jsonReport = path.join(absoluteOutputDir, 'typescript-coverage.json');
    const htmlReport = path.join(absoluteOutputDir, 'index.html');

    if (!fs.existsSync(jsonReport)) {
      logWarn(`⚠️ Missing typescript-coverage.json at ${jsonReport}`);
    }
    if (!fs.existsSync(htmlReport)) {
      logWarn(`⚠️ Missing index.html at ${htmlReport}`);
    }
    if (!fs.existsSync(looseTypeReport)) {
      logWarn(`⚠️ Missing loose-types.json at ${looseTypeReport}`);
    }

    return ok;
  });
}

/**
 * Main CLI entrypoint for TypeScript coverage analysis.
 */
function main() {
  try {
    ensureBinExists(tsTypesCoverageBin, 'typescript-coverage-report');

    const { appFolders } = parseCliTargets(appsDir);

    runAppsAnalysis({
      appsDir,
      appFolders,
      requireReact: true,
      binaryLabel: 'Type coverage',
      appRunner: runAppTypesCoverage,
      reportsRootDirName: typesCoverageReportsRootDirName,
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
