import { existsSync, mkdirSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  pnpmAppsPlaybookPath,
  rootPackageJsonPath,
  yarnAppsPlaybookPath,
} from "../../playbook/pnpm-config.js";
import { parseJson } from "../utils/json-utils.js";
import { logger } from "./log-manager.js";

/**
 * Resolve canonical catalog file paths.
 *
 * Supports both the current `catalog/*.json` layout
 * and legacy `apps/*.json` / `registry/*.json` layouts for compatibility.
 */
export function getCatalogPaths() {
  logger.debug("Resolving catalog paths");
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

    const raw = await fs.readFile(file, "utf-8");
    if (!raw.trim()) {
      logger.warn(`⚠️ Catalog ${file} is empty. Ignoring.`);
      return [];
    }

    let v;
    try {
      v = parseJson(raw);
    } catch (err) {
      logger.error(`❌ Failed to parse catalog ${file}: ${err.message}`);
      logger.debug(`Parse error stack: ${err.stack}`);
      return [];
    }

    if (Array.isArray(v)) {
      logger.info(`📖 Loaded ${v.length} entries from catalog: ${file}`);
      logger.debug(`Sample entries: ${v.slice(0, 5).join(", ")}${v.length > 5 ? " ..." : ""}`);
      return v.map(String);
    }

    logger.warn(
      `⚠️ Catalog ${file} contains JSON but is not an array. Type: ${typeof v}. Ignoring.`
    );
    logger.debug(`Invalid catalog content: ${JSON.stringify(v, null, 2)}`);
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
        `❌ Cannot write catalog to ${file}: items is not an array (type: ${typeof items}).`
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

    logger.info(
      `✅ Successfully wrote ${unique.length} unique item(s) to catalog: ${file}`
    );
    logger.debug(`File size: ${bytes} bytes`);
  } catch (err) {
    logger.error(`❌ Failed to write catalog ${file}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
  }
}

/**
 * Add an app path to a given catalog file.
 *
 * - Idempotent: if the app is already present, no changes are made.
 * - Validates inputs and logs detailed errors/warnings.
 *
 * @param {string} file - Path to the catalog file.
 * @param {string} appPath - Path of the app to add.
 * @returns {Promise<void>}
 */
export async function addAppPathToCatalog(file, appPath) {
  logger.debug(`addAppPathToCatalog(file="${file}", appPath="${appPath}")`);
  try {
    if (!file || typeof file !== "string") {
      logger.error(`❌ Invalid catalog file path: ${file}`);
      return;
    }

    if (!appPath || typeof appPath !== "string") {
      logger.error(`❌ Invalid appPath provided: ${appPath}`);
      return;
    }

    const list = await readCatalog(file);

    if (!Array.isArray(list)) {
      logger.error(
        `❌ Catalog ${file} did not return an array. Aborting add operation.`
      );
      return;
    }

    if (!list.includes(appPath)) {
      list.push(appPath);
      await writeCatalog(file, list);
      logger.success(
        `➕ Added "${appPath}" to catalog ${path.relative(process.cwd(), file)}`
      );
    } else {
      logger.info(
        `ℹ "${appPath}" already present in ${path.relative(process.cwd(), file)}`
      );
    }
  } catch (err) {
    logger.error(
      `❌ Failed to add "${appPath}" to catalog ${file}: ${err.message}`
    );
    logger.debug(`Stack trace: ${err.stack}`);
  }
}

/**
 * Remove an app path from a given catalog file.
 *
 * - Idempotent: if the app is not present, no changes are made.
 * - Logs success, info, and error cases explicitly.
 *
 * @param {string} file - Path to the catalog file.
 * @param {string} appPath - Path of the app to remove.
 * @returns {Promise<void>}
 */
export async function removeAppPathFromCatalog(file, appPath) {
  logger.debug(`removeAppPathFromCatalog(file="${file}", appPath="${appPath}")`);
  try {
    if (!file || typeof file !== "string") {
      logger.error(`❌ Invalid catalog file path: ${file}`);
      return;
    }

    if (!appPath || typeof appPath !== "string") {
      logger.error(`❌ Invalid appPath provided: ${appPath}`);
      return;
    }

    const list = await readCatalog(file);
    if (!Array.isArray(list)) {
      logger.error(`❌ Catalog ${file} did not return an array. Aborting remove operation.`);
      return;
    }

    const next = list.filter((p) => p !== appPath);
    if (next.length !== list.length) {
      await writeCatalog(file, next);
      logger.success(`🗑️ Removed "${appPath}" from ${path.relative(process.cwd(), file)}`);
    } else {
      logger.info(`ℹ "${appPath}" already absent in ${path.relative(process.cwd(), file)}`);
    }
  } catch (err) {
    logger.error(`❌ Failed to remove "${appPath}" from catalog ${file}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
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
  logger.debug("updateRootWorkspacesFromCatalogs()");
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

    logger.debug(`Merged workspace entries (sample): ${merged.slice(0, 5).join(", ")}${merged.length > 5 ? " ..." : ""}`);

    const raw = await fs.readFile(rootPackageJsonPath, "utf-8");
    const pkg = parseJson(raw);

    if (!pkg.workspaces || typeof pkg.workspaces !== "object") {
      logger.warn("⚠️ Root package.json had no valid workspaces field. Creating a new one.");
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
  logger.debug("updateRootWorkspacesToYarnOnly()");
  try {
    const { yarnCatalogPath } = getCatalogPaths();
    logger.info(`Yarn catalog path: ${yarnCatalogPath}`);

    const yarnList = await readCatalog(yarnCatalogPath);
    logger.info(`📦 Switching root workspaces to Yarn-only (${yarnList.length} apps)`);

    const raw = await fs.readFile(rootPackageJsonPath, "utf-8");
    const pkg = parseJson(raw);

    if (!pkg.workspaces || typeof pkg.workspaces !== "object") {
      logger.warn("⚠️ Root package.json had no valid workspaces field. Creating a new one.");
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
  logger.debug("updateRootWorkspacesToPnpmOnly()");
  try {
    const { pnpmCatalogPath } = getCatalogPaths();
    logger.info(`PNPM catalog path: ${pnpmCatalogPath}`);

    const pnpmList = await readCatalog(pnpmCatalogPath);
    logger.info(`📦 Switching root workspaces to PNPM-only (${pnpmList.length} apps)`);

    const raw = await fs.readFile(rootPackageJsonPath, "utf-8");
    const pkg = parseJson(raw);

    if (!pkg.workspaces || typeof pkg.workspaces !== "object") {
      logger.warn("⚠️ Root package.json had no valid workspaces field. Creating a new one.");
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
