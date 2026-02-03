import { Buffer } from 'node:buffer';
import { existsSync, mkdirSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import {
  managerRootPath,
  pnpmAppsPlaybookPath,
  privateModulesPath,
  toolsPlaybookPath,
  yarnAppsPlaybookPath,
} from '../../playbook/playbook-config.js';
import { logger } from './log-manager.js';

/**
 * Resolve canonical catalogs files paths.
 *
 * Supports both the current `catalog/*.json` layout
 * and legacy `apps/*.json` / `registry/*.json` layouts for compatibility.
 */
export function getCatalogsPaths() {
  logger.debug('Resolving catalogs paths');
  return {
    pnpmCatalogPath: pnpmAppsPlaybookPath,
    yarnCatalogPath: yarnAppsPlaybookPath,
    toolsCatalogPath: toolsPlaybookPath,
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
 * Check if an target is listed in a catalog and is a valid workspace.
 *
 * @param {string} catalogPath - Path to the catalog JSON.
 * @param {string} targetPath - Relative target workspace path.
 * @returns {Promise<boolean>} True if target exists in catalog and has a package.json.
 */
export async function isTargetInCatalog(catalogPath, targetPath) {
  logger.debug(`isTargetInCatalog(catalog="${catalogPath}", targetPath="${targetPath}")`);
  try {
    const pkgFile = path.join(targetPath, 'package.json');
    if (!existsSync(pkgFile)) {
      logger.warn(`⚠️ Workspace path "${targetPath}" has no package.json. Skipping check.`);
      return false;
    }

    const list = await readCatalog(catalogPath);
    const found = Array.isArray(list) && list.includes(targetPath);

    if (found) {
      logger.debug(
        `✔ "${targetPath}" found in catalog ${path.relative(process.cwd(), catalogPath)}`,
      );
    } else {
      logger.info(
        `ℹ "${targetPath}" is not listed in catalog ${path.relative(process.cwd(), catalogPath)}`,
      );
    }

    return found;
  } catch (err) {
    logger.error(`❌ Failed to check catalog ${catalogPath} for "${targetPath}": ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return false;
  }
}

/**
 * Add a target path to a given catalog file.
 *
 * @param {string} catalogPath - Path to the catalog file.
 * @param {string} targetPath - Path of the target to add.
 * @returns {Promise<"added"|"noop"|"invalid"|"error">}
 */
export async function addTargetPathToCatalog(catalogPath, targetPath) {
  logger.debug(`addTargetPathToCatalog(catalog="${catalogPath}", targetPath="${targetPath}")`);
  try {
    const pkgFile = path.join(targetPath, 'package.json');
    if (!existsSync(pkgFile)) {
      logger.warn(`⚠️ "${targetPath}" is not a valid workspace (no package.json).`);
      return 'invalid';
    }

    const isInCatalog = await isTargetInCatalog(catalogPath, targetPath);
    if (isInCatalog) {
      return 'noop';
    }

    const list = await readCatalog(catalogPath);
    list.push(targetPath);
    await writeCatalog(catalogPath, list);
    logger.success(
      `➕ Added target "${targetPath}" to catalog: ${path.relative(process.cwd(), catalogPath)}`,
    );
    return 'added';
  } catch (err) {
    logger.error(
      `❌ Unexpected failure adding "${targetPath}" to catalog "${catalogPath}": ${err.message}`,
    );
    logger.debug(`Stack trace: ${err.stack}`);
    return 'error';
  }
}

/**
 * Remove a target path from a given catalog file.
 *
 * @param {string} catalogPath - Path to the catalog file.
 * @param {string} targetPath - Path of the target to remove.
 * @returns {Promise<"removed"|"noop"|"invalid"|"error">}
 */
export async function removeTargetPathFromCatalog(catalogPath, targetPath) {
  logger.debug(`removeTargetPathFromCatalog(catalog="${catalogPath}", targetPath="${targetPath}")`);
  try {
    const pkgFile = path.join(targetPath, 'package.json');
    if (!existsSync(pkgFile)) {
      logger.warn(`⚠️ "${targetPath}" is not a valid workspace (no package.json).`);
      return 'invalid';
    }

    const catalogApps = await readCatalog(catalogPath);
    if (!catalogApps.includes(targetPath)) {
      return 'noop';
    }

    const updatedCatalogApps = catalogApps.filter((catalogApp) => catalogApp !== targetPath);
    await writeCatalog(catalogPath, updatedCatalogApps);
    logger.success(
      `🗑️ Removed target "${targetPath}" from catalog: ${path.relative(process.cwd(), catalogPath)}`,
    );
    return 'removed';
  } catch (err) {
    logger.error(
      `❌ Unexpected failure removing "${targetPath}" from catalog "${catalogPath}": ${err.message}`,
    );
    logger.debug(`Stack trace: ${err.stack}`);
    return 'error';
  }
}

/**
 * Update workspace catalogs by removing the target path
 * from one catalog and adding it to another.
 *
 * @async
 * @param {Object} params - Function parameters.
 * @param {string} params.fromPath - Source catalog path (to remove from).
 * @param {string} params.toPath - Target catalog path (to add to).
 * @param {string} params.targetPath - Relative path of the target.
 * @returns {Promise<boolean>} - True if catalog update succeeded,
 *   false if skipped due to invalid workspace.
 * @throws {Error} If catalog update fails with an error status.
 */
export async function updateCatalogs({ fromPath, toPath, targetPath }) {
  const removed = await removeTargetPathFromCatalog(fromPath, targetPath);
  const added = await addTargetPathToCatalog(toPath, targetPath);

  logger.info(`ℹ️ Catalog updates:
       • Removed from ${fromPath.includes('pnpm') ? 'PNPM' : 'Yarn'} → ${removed}
       • Added to ${toPath.includes('pnpm') ? 'PNPM' : 'Yarn'} → ${added}`);

  if (removed === 'invalid' || added === 'invalid') {
    logger.warn(`⚠️ Skipped: "${targetPath}" is not a valid workspace.`);
    return false;
  }

  if (removed === 'error' || added === 'error') {
    throw new Error(`Catalog update failed for "${targetPath}"`);
  }

  return true;
}

/**
 * Ensure a module is registered in the private PNPM modules catalog.
 *
 * @param {Object} params
 * @param {string} params.turboFilter - Turbo filter (e.g., "--filter @ovh-ux/manager-core-utils")
 * @param {string} params.pnpmPath - Relative path to the module (e.g., "packages/manager/core/utils")
 * @returns {Promise<boolean>} True if added, false if already present or invalid.
 */
export async function addPrivateModuleToCatalog({ turboFilter, pnpmPath }) {
  logger.debug(`addPrivateModuleToCatalog(turboFilter="${turboFilter}", pnpmPath="${pnpmPath}")`);

  try {
    // 1️⃣ Ensure catalog file exists or initialize an empty one
    let entries = [];
    if (existsSync(privateModulesPath)) {
      const raw = await fs.readFile(privateModulesPath, 'utf8');
      try {
        entries = JSON.parse(raw);
      } catch (err) {
        logger.error(`❌ Failed to parse ${privateModulesPath}: ${err.message}`);
        return false;
      }
    } else {
      logger.warn(`⚠️ Private modules catalog not found. Creating a new one.`);
    }

    if (!Array.isArray(entries)) {
      logger.error(`❌ Invalid catalog format in ${privateModulesPath}: expected an array`);
      entries = [];
    }

    // 2️⃣ Normalize inputs
    const normalizedTurbo = turboFilter.trim();
    const normalizedPnpm = pnpmPath.trim().replace(managerRootPath, '').replace(/^\/+/, '');

    // 3️⃣ Check if already present
    const alreadyExists = entries.some(
      (entry) => entry.turbo === normalizedTurbo || entry.pnpm === normalizedPnpm,
    );

    if (alreadyExists) {
      logger.info(`ℹ️ Private module already registered: ${normalizedPnpm}`);
      return false;
    }

    // 4️⃣ Add and sort alphabetically by pnpm path
    entries.push({ turbo: normalizedTurbo, pnpm: normalizedPnpm });
    entries.sort((a, b) => a.pnpm.localeCompare(b.pnpm));

    // 5️⃣ Persist
    const jsonData = JSON.stringify(entries, null, 2);
    await fs.writeFile(privateModulesPath, jsonData, 'utf8');

    logger.success(`➕ Added private module to catalog: ${normalizedTurbo} (${normalizedPnpm})`);
    logger.debug(`🗂 Updated ${privateModulesPath} with ${entries.length} entries`);
    return true;
  } catch (err) {
    logger.error(`❌ Failed to update private modules catalog: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return false;
  }
}

/**
 * Remove a module from the private PNPM modules catalog.
 *
 * @param {Object} params
 * @param {string} params.turboFilter - Turbo filter (e.g., "--filter @ovh-ux/manager-core-utils")
 * @param {string} params.pnpmPath - Relative path to the module (e.g., "packages/manager/core/utils")
 * @returns {Promise<boolean>} True if removed, false if not found or invalid.
 */
export async function removePrivateModuleFromCatalog({ turboFilter, pnpmPath }) {
  logger.debug(
    `removePrivateModuleFromCatalog(turboFilter="${turboFilter}", pnpmPath="${pnpmPath}")`,
  );

  try {
    if (!existsSync(privateModulesPath)) {
      logger.info(`ℹ️ Private catalog file not found: ${privateModulesPath}`);
      return false;
    }

    const raw = await fs.readFile(privateModulesPath, 'utf8');
    let entries = [];
    try {
      entries = JSON.parse(raw);
    } catch (err) {
      logger.error(`❌ Failed to parse ${privateModulesPath}: ${err.message}`);
      return false;
    }

    if (!Array.isArray(entries)) {
      logger.error(`❌ Invalid catalog format in ${privateModulesPath}: expected an array`);
      return false;
    }

    const normalizedTurbo = turboFilter.trim();
    const normalizedPnpm = pnpmPath.trim();

    const beforeCount = entries.length;
    entries = entries.filter(
      (entry) => entry.turbo !== normalizedTurbo && entry.pnpm !== normalizedPnpm,
    );

    if (entries.length === beforeCount) {
      logger.info(`ℹ️ Private module not found in catalog: ${normalizedPnpm}`);
      return false;
    }

    await fs.writeFile(privateModulesPath, JSON.stringify(entries, null, 2), 'utf8');
    logger.success(
      `🗑️  Removed private module from catalog: ${normalizedTurbo} (${normalizedPnpm})`,
    );
    return true;
  } catch (err) {
    logger.error(`❌ Failed to remove private module from catalog: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return false;
  }
}

/**
 * Load the tools catalog JSON (tools-catalog.json).
 *
 * @async
 * @function loadToolsCatalog
 * @returns {Promise<Record<string, import('../src/kernel/utils/tools-injector.js').ToolCatalogEntry>>}
 * Parsed catalog object.
 */
export async function loadToolsCatalog() {
  const toolsCatalogRaw = await fs.readFile(toolsPlaybookPath, 'utf-8');
  return JSON.parse(toolsCatalogRaw);
}
