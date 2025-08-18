import { execSync } from 'node:child_process';
import {
  addAppPathToCatalog,
  getCatalogPaths, isAppInCatalog,
  removeAppPathFromCatalog,
} from '../commons/catalog-utils.js';
import { logger } from '../commons/log-manager.js';
import { buildAppWorkspacePath, cleanAppDirs } from '../commons/workspace-utils.js';
import { normalizeReactDependencies } from '../commons/dependencies-utils.js';
import { patchVitestConfig } from './pnpm-config-manager.js';

/**
 * Add an application to the PNPM workflow.
 *
 * Steps performed:
 *   1. Skip if app is already in PNPM catalog
 *   2. Normalize React-related dependencies
 *   3. Remove the app from Yarn catalog
 *   4. Add the app to PNPM catalog
 *   5. Clean old package-manager artifacts
 *   6. Patch vitest config if needed
 *   7. Run `yarn install` automatically
 *   8. Show final build/test banner
 *
 * @param {string} appRef - Application reference (name, package name, or workspace path).
 */
export async function addAppToPnpm(appRef) {
  logger.debug(`addAppToPnpm(appRef="${appRef}")`);
  if (!appRef) throw new Error('addAppToPnpm: appRef is required');

  const relAppPath = buildAppWorkspacePath(appRef);

  logger.info(`
------------------------------------------------------------
🚀 Starting migration of "${relAppPath}" to PNPM

⚠️ This operation can take several minutes because it will:
   • Normalize critical React dependency versions
   • Update Yarn and PNPM catalogs
   • Clean old package-manager artifacts
   • Patch vitest configuration
   • Run a full "yarn install" at the repo root

Please do not interrupt this process.
------------------------------------------------------------
  `);

  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogPaths();

    const inPnpm = await isAppInCatalog(pnpmCatalogPath, relAppPath);
    if (inPnpm) {
      logger.info(`ℹ️ App "${relAppPath}" already exists in PNPM catalog. Nothing to do.`);
      return;
    }

    await normalizeReactDependencies(relAppPath);

    const removed = await removeAppPathFromCatalog(yarnCatalogPath, relAppPath);
    const added = await addAppPathToCatalog(pnpmCatalogPath, relAppPath);

    logger.info(`ℹ️ Catalog updates:
       • Removed from Yarn → ${removed}
       • Added to PNPM → ${added}`);

    if (removed === 'invalid' || added === 'invalid') {
      logger.warn(`⚠️ Migration skipped: "${relAppPath}" is not a valid workspace.`);
      return;
    }
    if (removed === 'error' || added === 'error') {
      throw new Error(`Catalog update failed for "${relAppPath}"`);
    }

    await cleanAppDirs(relAppPath);
    await patchVitestConfig(relAppPath);

    logger.success(`✅ "${relAppPath}" is now tracked in PNPM and visible to Turbo.`);

    logger.info(`📦 Running "yarn install" to refresh root workspaces...`);
    try {
      execSync('yarn install', { stdio: 'inherit' });
      logger.success(`✔ Dependencies installed. Migration of "${relAppPath}" complete.`);
    } catch (installErr) {
      logger.error(`❌ "yarn install" failed: ${installErr.message}`);
      throw installErr;
    }

    logger.info(`
------------------------------------------------------------
🏗️  Next recommended step: full monorepo build & test

To validate the migration is done successfully for "${relAppPath}"
and does not introduce side-effects across all apps, run:

   yarn build
   yarn test   # optional

This will:
   • Rebuild the entire repository with updated catalogs
   • Ensure "${relAppPath}" is properly integrated
   • Catch regressions early (type, lint, test)

⚠️  Build is manual by design to keep migration predictable.
------------------------------------------------------------
`);
  } catch (err) {
    logger.error(`❌ Migration failed for "${relAppPath}": ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    throw err;
  }
}

/**
 * Remove an application from the PNPM workflow (rollback to Yarn).
 *
 * Steps performed:
 *   1. Skip if app is not in PNPM catalog
 *   2. Remove the app from PNPM catalog
 *   3. Add the app back to Yarn catalog
 *   4. Clean PNPM-specific artifacts
 *   5. Run `yarn install` automatically
 *   6. Show final build/test banner
 *
 * @param {string} appRef - Application reference (name, package name, or workspace path).
 */
export async function removeAppFromPnpm(appRef) {
  logger.debug(`removeAppFromPnpm(appRef="${appRef}")`);
  if (!appRef) throw new Error('removeAppFromPnpm: appRef is required');

  const relAppPath = buildAppWorkspacePath(appRef);

  logger.info(`
------------------------------------------------------------
♻️ Rolling back "${relAppPath}" to Yarn

⚠️ This operation can take several minutes because it will:
   • Update PNPM and Yarn catalogs
   • Clean PNPM-specific artifacts
   • Run a full "yarn install" at the repo root

Please do not interrupt this process.
------------------------------------------------------------
  `);

  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogPaths();

    const inPnpm = await isAppInCatalog(pnpmCatalogPath, relAppPath);
    if (!inPnpm) {
      logger.info(`ℹ️ App "${relAppPath}" does not exist in PNPM catalog. Nothing to do.`);
      return;
    }

    const removed = await removeAppPathFromCatalog(pnpmCatalogPath, relAppPath);
    const added = await addAppPathToCatalog(yarnCatalogPath, relAppPath);

    logger.info(`ℹ️ Catalog updates:
       • Removed from PNPM → ${removed}
       • Added to Yarn → ${added}`);

    if (removed === 'invalid' || added === 'invalid') {
      logger.warn(`⚠️ Rollback skipped: "${relAppPath}" is not a valid workspace.`);
      return;
    }
    if (removed === 'error' || added === 'error') {
      throw new Error(`Catalog update failed for "${relAppPath}"`);
    }

    await cleanAppDirs(relAppPath);

    logger.success(`✅ "${relAppPath}" is now tracked in Yarn and visible to Turbo.`);

    logger.info(`📦 Running "yarn install" to refresh root workspaces...`);
    try {
      execSync('yarn install', { stdio: 'inherit' });
      logger.success(`✔ Dependencies installed. Rollback of "${relAppPath}" complete.`);
    } catch (installErr) {
      logger.error(`❌ "yarn install" failed: ${installErr.message}`);
      throw installErr;
    }

    logger.info(`
------------------------------------------------------------
🏗️  Next recommended step: full monorepo build & test

To validate the rollback is done successfully for "${relAppPath}"
and does not introduce side-effects across all apps, run:

   yarn build
   yarn test   # optional

This will:
   • Rebuild the entire repository with updated catalogs
   • Ensure "${relAppPath}" is properly restored
   • Catch regressions early (type, lint, test)

⚠️  Build is manual by design to keep rollback predictable.
------------------------------------------------------------
`);
  } catch (err) {
    logger.error(`❌ Rollback failed for "${relAppPath}": ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    throw err;
  }
}
