import { Buffer } from 'node:buffer';
import { exec } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

import {
  pnpmAppsPlaybookPath,
  rootPackageJsonPath,
  yarnAppsPlaybookPath,
} from '../../playbook/playbook-config.js';
import { logger } from './log-manager.js';

const execAsync = promisify(exec);

/**
 * Resolve canonical catalog file paths.
 *
 * Supports both the current `catalog/*.json` layout
 * and legacy `apps/*.json` / `registry/*.json` layouts for compatibility.
 */
export function getCatalogPaths() {
  logger.debug('Resolving catalog paths');
  return {
    pnpmCatalogPath: pnpmAppsPlaybookPath,
    yarnCatalogPath: yarnAppsPlaybookPath,
  };
}

/**
 * Reads a catalog file and returns its content as an array of strings.
 *
 * @param {string} file - Path to the catalog file.
 * @returns {Promise<string[]>} Array of strings from the catalog, or empty array if invalid.
 */
export async function readCatalog(file) {
  logger.debug(`readCatalog(file="${file}")`);
  try {
    if (!existsSync(file)) {
      logger.debug(`ℹ️ Catalog file does not exist: ${file}`);
      return [];
    }

    const raw = await fs.readFile(file, 'utf-8');
    if (!raw.trim()) {
      logger.warn(`⚠️ Catalog ${file} is empty. Ignoring.`);
      return [];
    }

    let catalog;
    try {
      catalog = JSON.parse(raw);
    } catch (err) {
      logger.error(`❌ Failed to parse catalog ${file}: ${err.message}`);
      logger.debug(`Parse error stack: ${err.stack}`);
      return [];
    }

    if (Array.isArray(catalog)) {
      logger.info(`📖 Loaded ${catalog.length} entries from catalog: ${file}`);
      logger.debug(
        `Sample entries: ${catalog.slice(0, 5).join(', ')}${catalog.length > 5 ? ' ...' : ''}`,
      );
      return catalog.map(String);
    }

    logger.warn(
      `⚠️ Catalog ${file} contains JSON but is not an array. Type: ${typeof catalog}. Ignoring.`,
    );
    logger.debug(`Invalid catalog content: ${JSON.stringify(catalog, null, 2)}`);
    return [];
  } catch (err) {
    logger.error(`❌ Unexpected error reading catalog ${file}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return [];
  }
}

/**
 * Persist catalog list to disk.
 *
 * - Deduplicates items.
 * - Preserves caller order.
 * - Creates the directory if missing.
 *
 * @param {string} file - Path to the catalog file.
 * @param {string[]} items - Items to persist.
 * @returns {Promise<void>}
 */
export async function writeCatalog(file, items) {
  logger.debug(`writeCatalog(file="${file}", itemsCount=${items?.length})`);
  try {
    const dir = path.dirname(file);
    if (!existsSync(dir)) {
      logger.debug(`ℹ️ Catalog directory not found, creating: ${dir}`);
      mkdirSync(dir, { recursive: true });
    }

    if (!Array.isArray(items)) {
      logger.error(
        `❌ Cannot write catalog to ${file}: items is not an array (type: ${typeof items}).`,
      );
      return;
    }

    const unique = Array.from(new Set(items.map(String)));

    if (unique.length === 0) {
      logger.warn(`⚠️ Attempting to write empty catalog to ${file}.`);
    }

    const data = JSON.stringify(unique, null, 2);
    await fs.writeFile(file, data);
    const bytes = Buffer.byteLength(data);

    logger.info(`✅ Successfully wrote ${unique.length} unique item(s) to catalog: ${file}`);
    logger.debug(`File size: ${bytes} bytes`);
  } catch (err) {
    logger.error(`❌ Failed to write catalog ${file}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
  }
}

/**
 * Check if an app is listed in a catalog and is a valid workspace.
 *
 * @param {string} catalogPath - Path to the catalog JSON.
 * @param {string} appPath - Relative app workspace path.
 * @returns {Promise<boolean>} True if app exists in catalog and has a package.json.
 */
export async function isAppInCatalog(catalogPath, appPath) {
  logger.debug(`isAppInCatalog(catalog="${catalogPath}", app="${appPath}")`);
  try {
    const pkgFile = path.join(appPath, 'package.json');
    if (!existsSync(pkgFile)) {
      logger.warn(`⚠️ Workspace path "${appPath}" has no package.json. Skipping check.`);
      return false;
    }

    const list = await readCatalog(catalogPath);
    const found = Array.isArray(list) && list.includes(appPath);

    if (found) {
      logger.debug(`✔ "${appPath}" found in catalog ${path.relative(process.cwd(), catalogPath)}`);
    } else {
      logger.info(
        `ℹ "${appPath}" is not listed in catalog ${path.relative(process.cwd(), catalogPath)}`,
      );
    }

    return found;
  } catch (err) {
    logger.error(`❌ Failed to check catalog ${catalogPath} for "${appPath}": ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return false;
  }
}

/**
 * Add an app path to a given catalog file.
 *
 * @param {string} catalogPath - Path to the catalog file.
 * @param {string} appPath - Path of the app to add.
 * @returns {Promise<"added"|"noop"|"invalid"|"error">}
 */
export async function addAppPathToCatalog(catalogPath, appPath) {
  logger.debug(`addAppPathToCatalog(catalog="${catalogPath}", appPath="${appPath}")`);
  try {
    const pkgFile = path.join(appPath, 'package.json');
    if (!existsSync(pkgFile)) {
      logger.warn(`⚠️ "${appPath}" is not a valid workspace (no package.json).`);
      return 'invalid';
    }

    const isInCatalog = await isAppInCatalog(catalogPath, appPath);
    if (isInCatalog) {
      return 'noop';
    }

    const list = await readCatalog(catalogPath);
    list.push(appPath);
    await writeCatalog(catalogPath, list);
    logger.success(
      `➕ Added app "${appPath}" to catalog: ${path.relative(process.cwd(), catalogPath)}`,
    );
    return 'added';
  } catch (err) {
    logger.error(
      `❌ Unexpected failure adding "${appPath}" to catalog "${catalogPath}": ${err.message}`,
    );
    logger.debug(`Stack trace: ${err.stack}`);
    return 'error';
  }
}

/**
 * Remove an app path from a given catalog file.
 *
 * @param {string} catalogPath - Path to the catalog file.
 * @param {string} appPath - Path of the app to remove.
 * @returns {Promise<"removed"|"noop"|"invalid"|"error">}
 */
export async function removeAppPathFromCatalog(catalogPath, appPath) {
  logger.debug(`removeAppPathFromCatalog(catalog="${catalogPath}", appPath="${appPath}")`);
  try {
    const pkgFile = path.join(appPath, 'package.json');
    if (!existsSync(pkgFile)) {
      logger.warn(`⚠️ "${appPath}" is not a valid workspace (no package.json).`);
      return 'invalid';
    }

    const catalogApps = await readCatalog(catalogPath);
    if (!catalogApps.includes(appPath)) {
      return 'noop';
    }

    const updatedCatalogApps = catalogApps.filter((catalogApp) => catalogApp !== appPath);
    await writeCatalog(catalogPath, updatedCatalogApps);
    logger.success(
      `🗑️ Removed app "${appPath}" from catalog: ${path.relative(process.cwd(), catalogPath)}`,
    );
    return 'removed';
  } catch (err) {
    logger.error(
      `❌ Unexpected failure removing "${appPath}" from catalog "${catalogPath}": ${err.message}`,
    );
    logger.debug(`Stack trace: ${err.stack}`);
    return 'error';
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
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogPaths();
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
    const { yarnCatalogPath } = getCatalogPaths();
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
    const { pnpmCatalogPath } = getCatalogPaths();
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
 * Try to restore package.json from Git.
 *
 * @param {string} directory - Directory containing package.json
 * @param {string} file - Filename of package.json
 * @returns {Promise<boolean>} True if restored successfully
 */
async function tryGitRestore(directory, file) {
  try {
    logger.info(`Attempting to restore ${file} using Git...`);
    await execAsync(`git restore ${file}`, { cwd: directory });
    logger.success(`✔ Successfully restored ${file} from Git`);
    return true;
  } catch (err) {
    logger.warn(`⚠️ Git restore failed: ${err.message}`);
    logger.debug(`Git error stack: ${err.stack}`);
    return false;
  }
}

/**
 * Manually clear the workspaces field in root package.json.
 *
 * @returns {Promise<void>}
 */
async function clearWorkspacesManually() {
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

  const cwd = path.dirname(rootPackageJsonPath);
  const file = path.basename(rootPackageJsonPath);

  // --- Try Git restore first ---
  if (await tryGitRestore(cwd, file)) {
    return [];
  }

  // --- Fallback: manual clear ---
  await clearWorkspacesManually();
  return [];
}
