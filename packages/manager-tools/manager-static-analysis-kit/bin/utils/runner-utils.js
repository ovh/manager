import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { generateCombinedReports, readJsonSafe } from './file-utils.js';
import { logError, logInfo } from './log-utils.js';
import { isReactModule } from './module-utils.js';

/**
 * Ensure that a required binary exists before running an analysis command.
 *
 * This function verifies that a binary file exists at the given path.
 * If not found, it logs an error message and terminates the process
 * with exit code `1`.
 *
 * @param {string} binPath - Absolute path to the binary executable.
 * @param {string} label - Human-readable label for the binary (used in error logs).
 *
 * @example
 * ensureBinExists('/usr/local/bin/jscpd', 'JSCPD');
 * // → Exits process if binary is missing
 */
export function ensureBinExists(binPath, label) {
  if (!fs.existsSync(binPath)) {
    logError(`❌ ${label} binary not found at ${binPath}`);
    process.exit(1);
  }
}

/**
 * Execute a command synchronously using the system shell.
 *
 * This function spawns a child process that runs a binary or command
 * with the provided arguments, inheriting the parent process's stdio streams.
 * It returns `true` if the command completed successfully (exit code `0`).
 *
 * @param {string} bin - Executable name or absolute path to run.
 * @param {string[]} args - Command-line arguments for the executable.
 * @param {string} cwd - Working directory where the command will be executed.
 * @returns {boolean} `true` if the process exits with status `0`, otherwise `false`.
 *
 * @example
 * runCommand('eslint', ['--fix', '.'], process.cwd());
 * // → Runs ESLint and returns true if successful
 */
export function runCommand(bin, args, cwd) {
  const result = spawnSync(bin, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });
  return result.status === 0;
}

/**
 * Execute analysis for a single module.
 *
 * This internal helper encapsulates:
 *  - Module validation (`fullPath`, `package.json`, React module check)
 *  - Error handling for analysis execution
 *  - Delegation to a provided analysis runner
 *
 * @param {Object} options - Analysis parameters.
 * @param {Object} options.module - Module descriptor with metadata.
 * @param {Function} options.analysisRunner - Function `(fullPath, shortPath, context) => boolean`
 *   that performs the analysis for this module.
 * @returns {boolean} `true` if analysis succeeded for the module, otherwise `false`.
 *
 * @example
 * runModuleAnalysis({
 *   module: { fullPath: '/apps/zimbra', shortPath: 'zimbra', packageName: '@ovh-ux/manager-zimbra-app' },
 *   analysisRunner: runCoverageAnalysis,
 * });
 */
function runModuleAnalysis({ module, analysisRunner }) {
  const { fullPath, shortPath, packageName } = module || {};
  const pkgPath = path.join(fullPath, 'package.json');
  let isAnalysisComplete = false;

  if (!fs.existsSync(fullPath) || !fs.existsSync(pkgPath) || !isReactModule(pkgPath)) {
    logError(`❌ Module folder not found: ${module} → skipping`);
    return isAnalysisComplete;
  }

  try {
    isAnalysisComplete = analysisRunner(fullPath, shortPath, {
      pkgPath,
      moduleDir: fullPath,
      moduleFolder: shortPath,
      moduleShortName: packageName,
      pkg: readJsonSafe(pkgPath),
    });
  } catch (err) {
    logError(`❌ Fatal error while analyzing ${shortPath}: ${err.stack || err.message}`);
  }

  return isAnalysisComplete;
}

/**
 * Run a complete analysis across multiple modules and generate combined reports.
 *
 * This function orchestrates:
 *  1. Iterating over provided modules.
 *  2. Running analysis for each module (via `runModuleAnalysis`).
 *  3. Aggregating successful results.
 *  4. Generating combined JSON and HTML reports.
 *
 * If no modules are successfully analyzed, the process terminates with exit code `1`.
 *
 * @param {Object} options - Analysis configuration.
 * @param {Object[]} options.modules - Array of module descriptors (`{ fullPath, shortPath, packageName }`).
 * @param {string} options.binaryLabel - Label for the analysis type (e.g. "Type Coverage").
 * @param {Function} options.analysisRunner - Function executed per module to run analysis logic.
 * @param {string} options.reportsRootDirName - Directory under the output root to store reports.
 * @param {string} options.combinedJson - Filename for the combined JSON report.
 * @param {string} options.combinedHtml - Filename for the combined HTML report.
 * @param {Function} options.collectFn - Function used to aggregate individual module data.
 * @param {Function} options.generateHtmlFn - Function used to generate the combined HTML output.
 * @param {string} options.outputRootDir - Base path where reports should be written.
 * @returns {string[]} Array of successfully analyzed module short names.
 *
 * @example
 * runModulesAnalysis({
 *   modules,
 *   binaryLabel: 'Type Coverage',
 *   analysisRunner: runTypeCoverage,
 *   reportsRootDirName: 'types-coverage-reports',
 *   combinedJson: 'types-coverage-combined-report.json',
 *   combinedHtml: 'types-coverage-combined-report.html',
 *   collectFn: collectTypeCoverage,
 *   generateHtmlFn: generateTypeCoverageHtml,
 *   outputRootDir: './reports',
 * });
 */
export function runModulesAnalysis({
  modules,
  binaryLabel,
  analysisRunner,
  reportsRootDirName,
  combinedJson,
  combinedHtml,
  collectFn,
  generateHtmlFn,
  outputRootDir,
}) {
  /** @type {string[]} */
  const analyzed = [];

  for (const module of modules) {
    const isAnalysisComplete = runModuleAnalysis({
      module,
      analysisRunner,
    });

    if (isAnalysisComplete) analyzed.push(module.shortPath);
  }

  if (analyzed.length > 0) {
    if (typeof collectFn !== 'function' || typeof generateHtmlFn !== 'function') {
      logError(`❌ Invalid collector or HTML generator passed to ${binaryLabel} analysis`);
      process.exit(1);
    }

    generateCombinedReports(
      path.join(outputRootDir, reportsRootDirName),
      combinedJson,
      combinedHtml,
      collectFn,
      generateHtmlFn,
    );
    logInfo(`✅ ${binaryLabel} reports generated (per-app + combined).`);
  } else {
    logError('❌ No apps successfully analyzed. Exiting.');
    process.exit(1);
  }

  return analyzed;
}
