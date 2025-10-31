#!/usr/bin/env node
/**
 * @file analysis.mjs
 * @description
 * Unified entry point to run different code analysis tasks (duplication, performance,
 * tests coverage, type coverage) for the OVHcloud Manager libraries.
 *
 * Usage:
 *   yarn analysis <duplication|perf|tests|types> [...args]
 *
 * Example:
 *   yarn analysis duplication
 *   yarn analysis tests --verbose
 *
 * This script:
 *  - Accepts an analysis type as argument
 *  - Maps it to the corresponding CLI commands
 *  - Executes them sequentially via `yarn --cwd`
 *  - Provides color-coded logs and error handling
 */
import { execSync } from 'node:child_process';

/** @constant {string} root - Relative path to the monorepo root directory. */
const root = '../../';

/** @constant {string} library - Name of the target library under analysis. */
const library = '@ovh-ux/muk';

/**
 * @constant {string[]} argv - Command-line arguments passed to the script.
 * Extracts the analysis type (first) and any additional arguments (rest).
 */
const [type, ...extraArgs] = process.argv.slice(2);

/**
 * @typedef {Record<string, string[]>} TaskMap
 * @description
 * Mapping between analysis types and their corresponding Yarn tasks.
 */
const tasks = {
  duplication: [`manager-code-duplication --library ${library}`],
  perf: [`manager-perf-budgets --library ${library}`],
  tests: [
    'pm:prepare:legacy:workspace',
    `manager-tests-coverage --library ${library}`,
    'pm:remove:legacy:workspace',
  ],
  types: [`manager-types-coverage --library ${library}`],
};

/**
 * Prints a formatted error message and exits the process.
 * @param {string} message - The error message to display.
 * @param {number} [code=1] - The exit code (default: 1).
 */
function fail(message, code = 1) {
  console.error(`❌ ${message}`);
  process.exit(code);
}

/**
 * Runs a shell command synchronously, inheriting stdio from the parent process.
 * @param {string} command - The shell command to execute.
 * @throws Will throw an error if the command fails.
 */
function runCommand(command) {
  console.log(`\n🚀 Running: yarn --cwd ${root} ${command}\n`);
  execSync(`yarn --cwd ${root} ${command}`, { stdio: 'inherit' });
}

/**
 * Runs a sequence of analysis commands for the given type.
 * @param {string} analysisType - The analysis type (e.g., "tests", "types").
 * @param {string[]} commands - List of yarn commands to execute.
 */
function runAnalysis(analysisType, commands) {
  console.log(`🔍 Starting '${analysisType}' analysis...\n`);

  try {
    for (const cmd of commands) {
      runCommand(cmd);
    }
    console.log(`\n✅ ${analysisType} analysis completed successfully.\n`);
  } catch (err) {
    fail(`${analysisType} analysis failed.\n`);
  }
}

/**
 * Entry point: validates arguments and dispatches analysis execution.
 */
function main() {
  if (!type) {
    fail('Missing analysis type.\nUsage: yarn analysis <duplication|perf|tests|types>');
  }

  const commands = tasks[type];
  if (!commands) {
    fail(`Unknown analysis type '${type}'. Available: ${Object.keys(tasks).join(', ')}`);
  }

  runAnalysis(type, commands);
}

main();
