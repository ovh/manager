import { execSync } from 'node:child_process';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';

import { managerRootPath, rootPackageJsonPath } from '../../playbook/playbook-config.js';
import {
  buildApplicationWorkspacePath,
  getPackageNameFromApplication,
} from '../helpers/apps-workspace-helper.js';
import {
  buildModuleWorkspacePath,
  getPackageNameFromModule,
} from '../helpers/modules-workspace-helper.js';
import { resolveCiArgsToRun } from './cli-utils.js';
import { logger } from './log-manager.js';
import { clearRootWorkspaces } from './workspace-utils.js';

/**
 * Internal helper: derive the best Task Runner filter value for a given `appRef`.
 *
 * - Prefers the package name (`@scope/name`) if available.
 * - Falls back to the last path segment of the canonical workspace path.
 *
 * @param {string} appRef - Application reference (name, package name, or path).
 * @returns {string|null} The filter string for Task Runner, or `null` if unresolved.
 */
export function resolveApplicationBuildFilter(appRef) {
  logger.debug(`resolveApplicationBuildFilter(appRef="${appRef}")`);

  if (!appRef) {
    logger.warn('⚠️ No appRef provided, returning null.');
    return null;
  }

  try {
    const packageName = getPackageNameFromApplication(appRef);
    if (packageName) {
      logger.info(`📦 Resolved build filter to package name: ${packageName}`);
      return packageName; // Prefer the package name (@scope/name)
    }

    const applicationWorkspacePath = buildApplicationWorkspacePath(appRef);
    const applicationPathParts = applicationWorkspacePath.split('/');
    const applicationBuildFilter = applicationPathParts[applicationPathParts.length - 1] || null;

    if (!applicationBuildFilter) {
      logger.error(
        `❌ Failed to resolve build filter for appRef="${appRef}". Path: ${applicationWorkspacePath}`,
      );
      return null;
    }

    logger.info(`📂 Resolved build filter to workspace segment: ${applicationBuildFilter}`);

    return applicationBuildFilter;
  } catch (err) {
    logger.error(`❌ Exception in resolveBuildFilter for appRef="${appRef}": ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return null;
  }
}

/**
 * Internal helper: derive the best Task Runner build filter for a given `moduleRef`.
 *
 * - Prefers the package name (`@scope/name`) if available.
 * - Falls back to the last path segment of the canonical workspace path.
 * - Handles modules under any of the supported roots:
 *   - `packages/manager-tools/**`
 *   - `packages/manager/core/**`
 *   - `packages/manager/modules/**`
 *
 * Example:
 * ```bash
 * yarn manager-pm --action build --module @ovh-ux/manager-core-api
 * yarn manager-pm --action test --module packages/manager/modules/foo
 * yarn manager-pm --action lint --module core-shell-client
 * ```
 *
 * @param {string} moduleRef - Module reference (name, package name, or path).
 * @returns {string|null} The Task Runner filter string (usually a package name or last path segment),
 *                        or `null` if resolution failed.
 */
export function resolveModuleBuildFilter(moduleRef) {
  logger.debug(`resolveModuleBuildFilter(moduleRef="${moduleRef}")`);

  if (!moduleRef) {
    logger.warn('⚠️ No moduleRef provided, returning null.');
    return null;
  }

  try {
    // Prefer package name if resolvable
    const pkgName = getPackageNameFromModule(moduleRef);
    if (pkgName) {
      logger.info(`📦 Resolved module build filter to package name: ${pkgName}`);
      return pkgName;
    }

    // Fallback to workspace path segment
    const rel = buildModuleWorkspacePath(moduleRef); // e.g. packages/manager/core/api
    const parts = rel.split('/');
    const lastSegment = parts[parts.length - 1] || null;

    if (!lastSegment) {
      logger.error(`❌ Failed to resolve build filter for moduleRef="${moduleRef}". Path: ${rel}`);
      return null;
    }

    logger.info(`📂 Resolved module build filter to workspace segment: ${lastSegment}`);
    return lastSegment;
  } catch (err) {
    logger.error(`❌ Exception in resolveModuleBuildFilter for "${moduleRef}": ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return null;
  }
}

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

/**
 * Helper to run any CI task with centralized arg normalization.
 *
 * @param {(args: string[], runner: string) => Promise<void>} ciTaskFn
 * @param {{ passthrough: string[], filter?: string|null, opts: Record<string, string|boolean>, runner: string }} ctx
 * @param {{ resolveBaseArgs: Function, collectForwardedArgs: Function, isNxRunner: Function }} deps
 */
export async function runCiTask(ciTaskFn, ctx, deps) {
  const argsToRun = resolveCiArgsToRun({
    ...ctx,
    ...deps,
  });

  return ciTaskFn(argsToRun, ctx.runner);
}
