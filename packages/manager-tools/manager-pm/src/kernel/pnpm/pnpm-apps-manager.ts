import { consola } from 'consola';

import {
  addAppPathToCatalog,
  getCatalogPaths,
  removeAppPathFromCatalog,
} from '../commons/catalog-utils.js';
import { buildAppWorkspacePath } from '../commons/workspace-utils.js';

/**
 * Add an application to the PNPM workflow.
 *
 * Steps:
 *  1. Remove the app from the Yarn catalog
 *  2. Add the app to the PNPM catalog
 *  3. Refresh the root `workspaces.packages` field in `package.json`
 *     with the union of both Yarn and PNPM catalogs
 *
 * This ensures the application is migrated from Yarn to PNPM
 * while remaining visible to Turbo tasks.
 *
 * @param appRef - Application reference (name, package name, or workspace path).
 * @throws Error if `appRef` is missing.
 * @returns Promise that resolves once migration is complete.
 *
 * @example
 * ```ts
 * await addAppToPnpm('web'); // Migrates "packages/manager/apps/web" to PNPM
 * ```
 */
export async function addAppToPnpm(appRef: string): Promise<void> {
  if (!appRef) throw new Error('addAppToPnpm: appRef is required');

  const relAppPath = buildAppWorkspacePath(appRef); // "packages/manager/apps/<name>"

  consola.start(`🚀 Migrating "${relAppPath}" to PNPM`);

  const { pnpmCatalogPath, yarnCatalogPath } = getCatalogPaths();

  await removeAppPathFromCatalog(yarnCatalogPath, relAppPath);

  await addAppPathToCatalog(pnpmCatalogPath, relAppPath);

  consola.box(`✅ App "${relAppPath}" is now tracked in PNPM and visible to Turbo.`);
}

/**
 * Remove an application from the PNPM workflow (rollback to Yarn).
 *
 * Steps:
 *  1. Remove the app from the PNPM catalog
 *  2. Add the app to the Yarn catalog
 *  3. Refresh the root `workspaces.packages` field in `package.json`
 *     with the union of both Yarn and PNPM catalogs
 *
 * This effectively rolls back the migration of an app from PNPM,
 * restoring Yarn as its package manager while keeping it visible to Turbo.
 *
 * @param appRef - Application reference (name, package name, or workspace path).
 * @throws Error if `appRef` is missing.
 * @returns Promise that resolves once rollback is complete.
 *
 * @example
 * ```ts
 * await removeAppFromPnpm('web'); // Rolls back "packages/manager/apps/web" to Yarn
 * ```
 */
export async function removeAppFromPnpm(appRef: string): Promise<void> {
  if (!appRef) throw new Error('removeAppFromPnpm: appRef is required');

  const relAppPath = buildAppWorkspacePath(appRef); // "packages/manager/apps/<name>"

  consola.start(`♻️ Rolling back "${relAppPath}" to Yarn`);

  const { pnpmCatalogPath, yarnCatalogPath } = getCatalogPaths();

  await removeAppPathFromCatalog(pnpmCatalogPath, relAppPath);

  await addAppPathToCatalog(yarnCatalogPath, relAppPath);

  consola.box(`✅ App "${relAppPath}" is now tracked in Yarn and visible to Turbo.`);
}
