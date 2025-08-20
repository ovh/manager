import {
  addAppPathToCatalog,
  getCatalogPaths,
  removeAppPathFromCatalog,
} from "../commons/catalog-utils.js";
import { buildAppWorkspacePath } from "../commons/workspace-utils.js";
import { logger } from "../commons/log-manager.js";

/**
 * Add an application to the PNPM workflow.
 *
 * Steps:
 *  1. Remove the app from the Yarn catalog
 *  2. Add the app to the PNPM catalog
 *  3. Refresh the root `workspaces.packages` field in `package.json`
 *
 * This ensures the application is migrated from Yarn to PNPM
 * while remaining visible to Turbo tasks.
 *
 * @param {string} appRef - Application reference (name, package name, or workspace path).
 * @returns {Promise<void>}
 */
export async function addAppToPnpm(appRef) {
  logger.debug(`addAppToPnpm(appRef="${appRef}")`);
  if (!appRef) throw new Error("addAppToPnpm: appRef is required");

  const relAppPath = buildAppWorkspacePath(appRef);
  logger.info(`🚀 Migrating "${relAppPath}" to PNPM`);

  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogPaths();
    logger.debug(`Using PNPM catalog: ${pnpmCatalogPath}`);
    logger.debug(`Using Yarn catalog: ${yarnCatalogPath}`);

    await removeAppPathFromCatalog(yarnCatalogPath, relAppPath);
    await addAppPathToCatalog(pnpmCatalogPath, relAppPath);

    logger.success(`✅ App "${relAppPath}" is now tracked in PNPM and visible to Turbo.`);
  } catch (err) {
    logger.error(`❌ Failed to migrate "${relAppPath}" to PNPM: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    throw err;
  }
}

/**
 * Remove an application from the PNPM workflow (rollback to Yarn).
 *
 * Steps:
 *  1. Remove the app from the PNPM catalog
 *  2. Add the app to the Yarn catalog
 *  3. Refresh the root `workspaces.packages` field in `package.json`
 *
 * This effectively rolls back the migration of an app from PNPM,
 * restoring Yarn as its package manager while keeping it visible to Turbo.
 *
 * @param {string} appRef - Application reference (name, package name, or workspace path).
 * @returns {Promise<void>}
 */
export async function removeAppFromPnpm(appRef) {
  logger.debug(`removeAppFromPnpm(appRef="${appRef}")`);
  if (!appRef) throw new Error("removeAppFromPnpm: appRef is required");

  const relAppPath = buildAppWorkspacePath(appRef);
  logger.info(`♻️ Rolling back "${relAppPath}" to Yarn`);

  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogPaths();
    logger.debug(`Using PNPM catalog: ${pnpmCatalogPath}`);
    logger.debug(`Using Yarn catalog: ${yarnCatalogPath}`);

    await removeAppPathFromCatalog(pnpmCatalogPath, relAppPath);
    await addAppPathToCatalog(yarnCatalogPath, relAppPath);

    logger.success(`✅ App "${relAppPath}" is now tracked in Yarn and visible to Turbo.`);
  } catch (err) {
    logger.error(`❌ Failed to rollback "${relAppPath}" to Yarn: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    throw err;
  }
}
