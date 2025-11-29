import { execSync } from 'node:child_process';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';

import { managerRootPath, rootPackageJsonPath } from '../../playbook/playbook-config.js';
import { logger } from './log-manager.js';
import { clearRootWorkspaces } from './workspace-utils.js';

/**
 * Run `yarn install` at the repository root with optional CLI arguments.
 *
 * @param {string[]} [args=[]] - Extra Yarn CLI flags (e.g., ['--ignore-scripts', '--frozen-lockfile'])
 * @throws {Error} If the install command fails.
 */
export function runYarnInstall(args = []) {
  const fullCommand = ['yarn', 'install', ...args].join(' ');
  logger.info(`📦 Running "${fullCommand}" to refresh root workspaces...`);

  try {
    execSync(fullCommand, { stdio: 'inherit' });
    logger.success(`✔ Dependencies installed successfully.`);
  } catch (err) {
    logger.error(`❌ "yarn install" failed: ${err.message}`);
    throw err;
  }
}

/**
 * Temporarily modifies the root `package.json` workspaces field
 * to include only the given modules, runs `yarn install --ignore-scripts`,
 * and then restores the original configuration.
 *
 * @async
 * @param {string[]} modules - List of module workspace globs or paths to isolate.
 * @returns {Promise<void>} Resolves when isolation and installation complete.
 */
export async function runIsolatedModulesInstall(modules = []) {
  try {
    // Read and parse the root package.json
    const rawContent = await fs.readFile(rootPackageJsonPath, 'utf-8');
    const rootPackageJson = JSON.parse(rawContent);

    // Prepare a minimal workspaces field containing only the target modules
    if (!rootPackageJson.workspaces || typeof rootPackageJson.workspaces !== 'object') {
      logger.warn('⚠️ Root package.json has no valid "workspaces" field. Creating a new one.');
      rootPackageJson.workspaces = { packages: modules };
    } else {
      rootPackageJson.workspaces.packages = modules;
    }

    // Write the updated package.json
    await fs.writeFile(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2));
    logger.info(`📦 Isolated workspaces to: ${modules.join(', ') || '(none)'}`);

    // Run Yarn install for isolated modules (skip lifecycle scripts)
    await runYarnInstall(['--ignore-scripts']);
    logger.success('✔ Dependencies installed for isolated modules.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to isolate modules install: ${message}`);
    throw error;
  } finally {
    // Always restore original workspaces configuration
    await clearRootWorkspaces();
    logger.info('🧹 Restored original root workspaces.');
  }
}

/**
 * Spawn a child process and run a command with streamed output.
 *
 * @param {string} cmd - The command to run (e.g., "turbo" or "yarn").
 * @param {string[]} args - The arguments passed to the command.
 * @param {string} cwd - The working directory in which the command should run.
 * @returns {Promise<void>} Resolves when the process exits successfully, rejects on error or non-zero exit.
 */
export function runCommand(cmd, args, cwd) {
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
 * Run a task from root with centralized logging and error handling.
 *
 * @param {string} label - A human-friendly label for the task (e.g., "build (all apps)").
 * @param {string} cmd - The command to run (e.g., "turbo" or "yarn").
 * @param {string[]} args - Arguments to pass to the command.
 * @returns {Promise<void>} Resolves on success, logs and rethrows on failure.
 */
export async function runTaskFromRoot(label, cmd, args) {
  try {
    logger.info(`▶ ${cmd} ${args?.join(' ')}`);
    await runCommand(cmd, args, managerRootPath);
    logger.info(`✅ ${label} completed successfully`);
  } catch (error) {
    logger.error(`❌ ${label} failed:`);
    logger.error(error.stack || error.message || error);
    throw error;
  }
}
