import { spawn } from 'node:child_process';

import { managerRootPath } from '../../playbook/playbook-config.js';
import { clearRootWorkspaces, updateRootWorkspacesFromCatalogs } from '../commons/catalog-utils.js';
import { logger } from '../commons/log-manager.js';
import { resolveBuildFilter } from '../commons/task-utils.js';

/**
 * Spawn a child process and run a command with streamed output.
 *
 * @param {string} cmd - The command to run (e.g., "turbo" or "yarn").
 * @param {string[]} args - The arguments passed to the command.
 * @param {string} cwd - The working directory in which the command should run.
 * @returns {Promise<void>} Resolves when the process exits successfully, rejects on error or non-zero exit.
 */
function runCommand(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
    });

    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${cmd} ${args.join(' ')} failed with exit code ${code}`));
      }
    });
  });
}

/**
 * Run a task with centralized logging and error handling.
 *
 * @param {string} label - A human-friendly label for the task (e.g., "build (all apps)").
 * @param {string} cmd - The command to run (e.g., "turbo" or "yarn").
 * @param {string[]} args - Arguments to pass to the command.
 * @returns {Promise<void>} Resolves on success, logs and rethrows on failure.
 */
async function runTask(label, cmd, args) {
  try {
    logger.info(`▶ ${cmd} ${args.join(' ')}`);
    await runCommand(cmd, args, managerRootPath);
    logger.info(`✅ ${label} completed successfully`);
  } catch (error) {
    logger.error(`❌ ${label} failed:`);
    logger.error(error.stack || error.message || error);
    throw error;
  }
}

/**
 * Wrap a task with pre/post workspace handling.
 * Ensures catalogs are merged before and always cleared after execution,
 * even if the task fails.
 *
 * @template T
 * @param {() => Promise<T>} fn - The async function representing the task body.
 * @returns {Promise<T>} Resolves or rejects with the underlying task result.
 */
async function withWorkspaces(fn) {
  await updateRootWorkspacesFromCatalogs();
  try {
    return await fn();
  } finally {
    await clearRootWorkspaces();
  }
}

/**
 * Run a Turbo task (build or test) in CI mode with arbitrary Turbo CLI options.
 *
 * @async
 * @param {"build"|"test"} task - The Turbo task type to run.
 * @param {string[]} [options=[]] - Additional Turbo CLI options, e.g. ["--filter=docs...", "--parallel"].
 * @returns {Promise<void>} Resolves when the Turbo task completes successfully.
 */
export async function runTurboTaskCI(task, options = []) {
  return withWorkspaces(async () => {
    const args = ['run', task, ...options];
    await runTask(`${task} (CI)`, 'turbo', args);
  });
}

/**
 * Run a Turbo build in CI mode with arbitrary Turbo CLI options.
 *
 * Example:
 * ```bash
 * manager-pm --type pnpm --action buildCI -- --filter=app...
 * ```
 *
 * @async
 * @param {string[]} [options=[]] - Turbo CLI options passed to `turbo run build`.
 * @returns {Promise<void>} Resolves when the build finishes successfully.
 */
export async function buildCI(options = []) {
  return runTurboTaskCI('build', options);
}

/**
 * Run Turbo tests in CI mode with arbitrary Turbo CLI options.
 *
 * Example:
 * ```bash
 * manager-pm --type pnpm --action testCI -- --filter=tag:unit
 * ```
 *
 * @async
 * @param {string[]} [options=[]] - Turbo CLI options passed to `turbo run test`.
 * @returns {Promise<void>} Resolves when tests finish successfully.
 */
export async function testCI(options = []) {
  return runTurboTaskCI('test', options);
}

/**
 * Prepare and run a Turbo task (build or test).
 *
 * @param {"build"|"test"} task - The turbo task type to run.
 * @param {string|null} appRef - Optional app reference to filter on. If null, runs for all apps.
 * @param {number} concurrency - Concurrency level for the task.
 * @returns {Promise<void>} Resolves when the Turbo task completes.
 */
async function runTurboTask(task, appRef, concurrency = 1) {
  return withWorkspaces(async () => {
    const args = ['run', task, `--concurrency=${concurrency}`, '--continue=always'];
    const filter = resolveBuildFilter(appRef);
    if (filter) args.push('--filter', filter);
    await runTask(`${task}${appRef ? ` (${appRef})` : ' (all apps)'}`, 'turbo', args);
  });
}

/**
 * Build a specific application.
 *
 * @param {string} appRef - The app reference or package name.
 * @returns {Promise<void>} Resolves when the build finishes successfully.
 */
export async function buildApp(appRef) {
  return runTurboTask('build', appRef, 1);
}

/**
 * Run tests for a specific application.
 *
 * @param {string} appRef - The app reference or package name.
 * @returns {Promise<void>} Resolves when the tests complete successfully.
 */
export async function testApp(appRef) {
  return runTurboTask('test', appRef, 1);
}

/**
 * Build all applications.
 *
 * @returns {Promise<void>} Resolves when the build finishes successfully.
 */
export async function buildAll() {
  return runTurboTask('build', null, 1);
}

/**
 * Run tests for all applications.
 *
 * @returns {Promise<void>} Resolves when the tests complete successfully.
 */
export async function testAll() {
  return runTurboTask('test', null, 1);
}

/**
 * Run linting for a specific application using the hybrid lint runner.
 *
 * @param {string} appRef - The app reference or package name (required).
 * @throws {Error} If no appRef is provided or the package name cannot be resolved.
 * @returns {Promise<void>} Resolves when linting completes successfully.
 */
export async function lintApp(appRef) {
  if (!appRef) throw new Error('lintApp: appRef is required');
  return withWorkspaces(async () => {
    const pkgName = resolveBuildFilter(appRef);
    if (!pkgName) {
      throw new Error(`Unable to resolve package name for "${appRef}"`);
    }
    await runTask(`lint (${appRef})`, 'yarn', ['lint:tsx', '--', '--app', pkgName]);
  });
}

/**
 * Run linting for all applications.
 *
 * @returns {Promise<void>} Resolves when linting completes successfully.
 */
export async function lintAll() {
  return withWorkspaces(() =>
    runTask('lint (all apps)', 'yarn', ['pm:lint:base'])
  );
}

/**
 * Build the documentation workspace (@ovh-ux/manager-documentation).
 *
 * @returns {Promise<void>} Resolves when docs are built successfully.
 */
export async function buildDocs() {
  return withWorkspaces(() =>
    runTask(
      'docs build',
      'yarn',
      ['workspace', '@ovh-ux/manager-documentation', 'run', 'docs:build']
    )
  );
}

/**
 * Run the manager-cli workspace command with pre/post workspace handling.
 *
 * This ensures catalogs are merged before and cleaned after execution.
 *
 * Example:
 * ```bash
 * yarn manager-pm --type pnpm --action cli -- <args>
 * ```
 *
 * @param {string[]} [options=[]] - Additional arguments to pass to manager-cli.
 * @returns {Promise<void>} Resolves when the CLI completes successfully.
 */
export async function runManagerCli(options = []) {
  return withWorkspaces(() =>
    runTask('manager-cli', 'yarn', [
      'workspace',
      '@ovh-ux/manager-cli',
      'run',
      'manager-cli',
      ...options,
    ])
  );
}
