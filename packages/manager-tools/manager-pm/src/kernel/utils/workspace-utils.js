import { promises as fs } from 'node:fs';
import path from 'node:path';

import { cleanupDirectories, rootPackageJsonPath } from '../../playbook/playbook-config.js';
import { getCatalogsPaths, readCatalog } from './catalog-utils.js';
import { isCI } from './env-utils.js';
import { tryGitRestore } from './git-utils.js';
import { logger } from './log-manager.js';
import { toPosix } from './path-utils.js';

/**
 * Check if the provided path is likely a workspace-relative path.
 * @param {string} filePath - The path to check.
 * @returns {boolean} True if it's a workspace-relative path, otherwise false.
 */
export function isWorkspaceRelativePath(filePath) {
  const normalizedPath = toPosix(filePath);
  return normalizedPath.startsWith('packages/') || normalizedPath.startsWith('./packages/');
}

/**
 * Clean up existing build and dependency folders in an app.
 *
 * Removes:
 *  - node_modules
 *  - dist
 *  - .turbo (Turbo cache)
 *
 * @param {string} appPath - Absolute path to the app folder
 */
export async function cleanArtifactDirectories(appPath) {
  logger.debug(`cleanAppDirs(appPath="${appPath}")`);
  for (const directory of cleanupDirectories) {
    const fullPath = path.join(appPath, directory);
    try {
      await fs.rm(fullPath, { recursive: true, force: true });
      logger.info(`🧹 [cleanup] Removed ${fullPath}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : err;
      logger.warn(`⚠️ [cleanup] Failed to remove ${fullPath}: ${message}`);
    }
  }
}

/**
 * Update the root `package.json` workspaces.packages field
 * with the merged content of both Yarn and PNPM catalogs.
 *
 * - Yarn catalog defines the base set (order preserved).
 * - PNPM catalog apps are appended (duplicates removed).
 *
 * @returns {Promise<string[]>} Final merged workspace paths.
 */
export async function updateRootWorkspacesFromCatalogs() {
  logger.debug('updateRootWorkspacesFromCatalogs()');
  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogsPaths();
    logger.info(`YARN catalog path: ${yarnCatalogPath}`);
    logger.info(`PNPM catalog path: ${pnpmCatalogPath}`);

    const yarnList = await readCatalog(yarnCatalogPath);
    const pnpmList = await readCatalog(pnpmCatalogPath);

    logger.info(`📦 Yarn apps: ${yarnList.length}, PNPM apps: ${pnpmList.length}`);

    const yarnSet = new Set(yarnList);
    const pnpmOnly = pnpmList.filter((p) => !yarnSet.has(p));
    const merged = [...yarnList, ...pnpmOnly];

    logger.debug(
      `Merged workspace entries (sample): ${merged.slice(0, 5).join(', ')}${merged.length > 5 ? ' ...' : ''}`,
    );

    const raw = await fs.readFile(rootPackageJsonPath, 'utf-8');
    const pkg = JSON.parse(raw);

    if (!pkg.workspaces || typeof pkg.workspaces !== 'object') {
      logger.warn('⚠️ Root package.json had no valid workspaces field. Creating a new one.');
      pkg.workspaces = { packages: merged };
    } else {
      pkg.workspaces.packages = merged;
    }

    await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
    logger.success(`✔ Updated root workspaces.packages (${merged.length} entries)`);
    return merged;
  } catch (err) {
    logger.error(`❌ Failed to update root workspaces from catalogs: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return [];
  }
}

/**
 * Overwrite root workspaces.packages with the Yarn catalog only.
 * Use before running `yarn install` so Yarn installs only its subset.
 *
 * @returns {Promise<string[]>} Yarn-only workspace paths.
 */
export async function updateRootWorkspacesToYarnOnly() {
  logger.debug('updateRootWorkspacesToYarnOnly()');
  try {
    const { yarnCatalogPath } = getCatalogsPaths();
    logger.info(`Yarn catalog path: ${yarnCatalogPath}`);

    const yarnList = await readCatalog(yarnCatalogPath);
    logger.info(`📦 Switching root workspaces to Yarn-only (${yarnList.length} apps)`);

    const raw = await fs.readFile(rootPackageJsonPath, 'utf-8');
    const pkg = JSON.parse(raw);

    if (!pkg.workspaces || typeof pkg.workspaces !== 'object') {
      logger.warn('⚠️ Root package.json had no valid workspaces field. Creating a new one.');
      pkg.workspaces = { packages: yarnList };
    } else {
      pkg.workspaces.packages = yarnList;
    }

    await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
    logger.success(`✔ Updated root workspaces.packages to Yarn-only (${yarnList.length} entries)`);
    return yarnList;
  } catch (err) {
    logger.error(`❌ Failed to update root workspaces to Yarn-only: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return [];
  }
}

/**
 * Overwrite root workspaces.packages with the PNPM catalog only.
 * Useful for debugging or isolated PNPM operations.
 *
 * @returns {Promise<string[]>} PNPM-only workspace paths.
 */
export async function updateRootWorkspacesToPnpmOnly() {
  logger.debug('updateRootWorkspacesToPnpmOnly()');
  try {
    const { pnpmCatalogPath } = getCatalogsPaths();
    logger.info(`PNPM catalog path: ${pnpmCatalogPath}`);

    const pnpmList = await readCatalog(pnpmCatalogPath);
    logger.info(`📦 Switching root workspaces to PNPM-only (${pnpmList.length} apps)`);

    const raw = await fs.readFile(rootPackageJsonPath, 'utf-8');
    const pkg = JSON.parse(raw);

    if (!pkg.workspaces || typeof pkg.workspaces !== 'object') {
      logger.warn('⚠️ Root package.json had no valid workspaces field. Creating a new one.');
      pkg.workspaces = { packages: pnpmList };
    } else {
      pkg.workspaces.packages = pnpmList;
    }

    await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
    logger.success(`✔ Updated root workspaces.packages to PNPM-only (${pnpmList.length} entries)`);
    return pnpmList;
  } catch (err) {
    logger.error(`❌ Failed to update root workspaces to PNPM-only: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return [];
  }
}

/**
 * Manually clear the workspaces field in root package.json.
 *
 * @returns {Promise<void>}
 */
export async function clearWorkspacesManually() {
  try {
    logger.info('Falling back to manual workspace clearing...');
    const rootPackageJsonContent = await fs.readFile(rootPackageJsonPath, 'utf-8');
    const rootPackageJson = JSON.parse(rootPackageJsonContent);

    if (
      !rootPackageJson.workspaces ||
      typeof rootPackageJson.workspaces !== 'object' ||
      Array.isArray(rootPackageJson.workspaces)
    ) {
      logger.warn('⚠️ Invalid or missing "workspaces" field. Creating new object form.');
      rootPackageJson.workspaces = { packages: [] };
    } else {
      rootPackageJson.workspaces.packages = [];
    }

    await fs.writeFile(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2));
    logger.success('✔ Cleared root workspaces.packages (manual fallback successful)');
  } catch (err) {
    logger.error(`❌ Failed to manually clear root workspaces: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
  }
}

/**
 * Attempt to restore the root `package.json` from Git.
 * Falls back to manually clearing workspaces if Git is unavailable or fails.
 *
 * - Uses `git restore` (requires Git ≥ 2.23, cross-platform)
 * - Ensures the file returns to a consistent empty state even on failure
 *
 * @returns {Promise<string[]>} Always returns an empty array.
 */
export async function clearRootWorkspaces() {
  logger.debug('clearRootWorkspaces()');

  if (isCI) {
    logger.info('ℹ️ CI detected — skipping workspace cleanup (ephemeral workspace)');
    return [];
  }

  const cwd = path.dirname(rootPackageJsonPath);
  const file = path.basename(rootPackageJsonPath);

  if (await tryGitRestore(cwd, file)) {
    return [];
  }

  await clearWorkspacesManually();
  return [];
}
