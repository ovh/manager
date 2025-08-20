import { consola } from 'consola';
import { existsSync, mkdirSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  pnpmAppsPlaybookPath,
  rootPackageJsonPath,
  yarnAppsPlaybookPath,
} from '../../playbook/pnpm-config.js';
import { CatalogFile, CatalogList, CatalogPaths } from '../types/commons/workspace-type.js';
import { parseJson } from '../utils/json-utils.js';

/**
 * Resolve canonical catalog file paths.
 *
 * Supports both the current `catalog/*.json` layout
 * and legacy `apps/*.json` / `registry/*.json` layouts for compatibility.
 */
export function getCatalogPaths(): CatalogPaths {
  return { pnpmCatalogPath: pnpmAppsPlaybookPath, yarnCatalogPath: yarnAppsPlaybookPath };
}

/**
 * Read a catalog file as an array of strings.
 *
 * @param file - Path to the catalog JSON file.
 * @returns Array of app paths (empty if missing or invalid).
 */
export async function readCatalog(file: CatalogFile): Promise<CatalogList> {
  if (!existsSync(file)) return [];
  const raw = await fs.readFile(file, 'utf-8');
  if (!raw.trim()) return [];
  try {
    const v = parseJson<unknown>(raw);
    if (Array.isArray(v)) return v.map(String);
    consola.warn(`⚠️ Catalog ${file} is not an array. Ignoring its content.`);
    return [];
  } catch (err) {
    consola.warn(`⚠️ Failed to parse catalog ${file}: ${(err as Error).message}`);
    return [];
  }
}

/**
 * Persist catalog list to disk.
 *
 * - Deduplicates items.
 * - Preserves caller order.
 */
export async function writeCatalog(file: CatalogFile, items: CatalogList): Promise<void> {
  const dir = path.dirname(file);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const unique = Array.from(new Set(items));
  await fs.writeFile(file, JSON.stringify(unique, null, 2));
}

/**
 * Add an app path to a given catalog file.
 *
 * Idempotent: if the app is already present, no changes are made.
 */
export async function addAppPathToCatalog(file: CatalogFile, appPath: string): Promise<void> {
  const list = await readCatalog(file);
  if (!list.includes(appPath)) {
    list.push(appPath);
    await writeCatalog(file, list);
    consola.success(`➕ Added "${appPath}" to ${path.relative(process.cwd(), file)}`);
  } else {
    consola.info(`ℹ "${appPath}" already present in ${path.relative(process.cwd(), file)}`);
  }
}

/**
 * Remove an app path from a given catalog file.
 *
 * Idempotent: if the app is not present, no changes are made.
 */
export async function removeAppPathFromCatalog(file: CatalogFile, appPath: string): Promise<void> {
  const list = await readCatalog(file);
  const next = list.filter((p) => p !== appPath);
  if (next.length !== list.length) {
    await writeCatalog(file, next);
    consola.success(`🗑️ Removed "${appPath}" from ${path.relative(process.cwd(), file)}`);
  } else {
    consola.info(`ℹ "${appPath}" already absent in ${path.relative(process.cwd(), file)}`);
  }
}

/**
 * Update the root `package.json` `workspaces.packages` field
 * with the merged content of both Yarn and PNPM catalogs.
 *
 * - Yarn catalog defines the base set (order preserved).
 * - PNPM catalog apps are appended (duplicates removed).
 *
 * @returns Final merged workspace paths.
 */
export async function updateRootWorkspacesFromCatalogs(): Promise<CatalogList> {
  const { pnpmCatalogPath, yarnCatalogPath } = getCatalogPaths();

  const yarnList = await readCatalog(yarnCatalogPath);
  const pnpmList = await readCatalog(pnpmCatalogPath);

  const yarnSet = new Set(yarnList);
  const pnpmOnly = pnpmList.filter((p) => !yarnSet.has(p));
  const merged = [...yarnList, ...pnpmOnly];

  const raw = await fs.readFile(rootPackageJsonPath, 'utf-8');
  const pkg = parseJson<Record<string, unknown>>(raw);

  if (!pkg.workspaces || typeof pkg.workspaces !== 'object') {
    pkg.workspaces = { packages: merged };
  } else {
    (pkg.workspaces as { packages: CatalogList }).packages = merged;
  }

  await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
  consola.success(`✔ Updated root workspaces.packages (${merged.length} entries)`);
  return merged;
}

/**
 * Overwrite root workspaces.packages with the Yarn catalog only.
 * Use before running `yarn install` so Yarn installs only its subset.
 */
export async function updateRootWorkspacesToYarnOnly(): Promise<CatalogList> {
  const { yarnCatalogPath } = getCatalogPaths();
  const yarnList = await readCatalog(yarnCatalogPath);

  const raw = await fs.readFile(rootPackageJsonPath, 'utf-8');
  const pkg = parseJson<Record<string, unknown>>(raw);

  if (!pkg.workspaces || typeof pkg.workspaces !== 'object') {
    pkg.workspaces = { packages: yarnList };
  } else {
    (pkg.workspaces as { packages: CatalogList }).packages = yarnList;
  }

  await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
  consola.success(`✔ Updated root workspaces.packages to Yarn-only (${yarnList.length} entries)`);
  return yarnList;
}

/**
 * Overwrite root workspaces.packages with the PNPM catalog only.
 * Useful for debugging or isolated PNPM operations.
 */
export async function updateRootWorkspacesToPnpmOnly(): Promise<CatalogList> {
  const { pnpmCatalogPath } = getCatalogPaths();
  const pnpmList = await readCatalog(pnpmCatalogPath);

  const raw = await fs.readFile(rootPackageJsonPath, 'utf-8');
  const pkg = parseJson<Record<string, unknown>>(raw);

  if (!pkg.workspaces || typeof pkg.workspaces !== 'object') {
    pkg.workspaces = { packages: pnpmList };
  } else {
    (pkg.workspaces as { packages: CatalogList }).packages = pnpmList;
  }

  await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
  consola.success(`✔ Updated root workspaces.packages to PNPM-only (${pnpmList.length} entries)`);
  return pnpmList;
}
