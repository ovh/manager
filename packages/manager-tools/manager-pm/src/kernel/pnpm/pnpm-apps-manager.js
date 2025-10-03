import { execSync } from 'node:child_process';

import {
  addAppPathToCatalog,
  getCatalogPaths,
  isAppInCatalog,
  removeAppPathFromCatalog,
} from '../utils/catalog-utils.js';
import { normalizeReactDependencies } from '../utils/dependencies-utils.js';
import { logger } from '../utils/log-manager.js';
import { buildAppWorkspacePath, cleanAppDirs } from '../utils/workspace-utils.js';
import { patchVitestConfig } from './pnpm-config-manager.js';

/**
 * Display a banner describing the migration process when adding
 * an application to PNPM.
 *
 * @param {string} appPath - Relative path of the application being migrated.
 */
function displayAddHelpBanner(appPath) {
  logger.info(`
------------------------------------------------------------
🚀 Starting migration of "${appPath}" to PNPM

⚠️ This operation can take several minutes because it will:
   • Normalize critical React dependency versions
   • Update Yarn and PNPM catalogs
   • Clean old package-manager artifacts
   • Patch vitest configuration
   • Run a full "yarn install" at the repo root

Please do not interrupt this process.
------------------------------------------------------------
  `);
}

/**
 * Display a banner describing the rollback process when removing
 * an application from PNPM (back to Yarn).
 *
 * @param {string} appPath - Relative path of the application being rolled back.
 */
function displayRemoveHelpBanner(appPath) {
  logger.info(`
------------------------------------------------------------
♻️ Rolling back "${appPath}" to Yarn

⚠️ This operation can take several minutes because it will:
   • Update PNPM and Yarn catalogs
   • Clean PNPM-specific artifacts
   • Run a full "yarn install" at the repo root

Please do not interrupt this process.
------------------------------------------------------------
  `);
}

/**
 * Display final recommended build/test instructions
 * after migration or rollback is completed.
 *
 * @param {string} appPath - Relative path of the application migrated/rolled back.
 * @param {'migration'|'rollback'} [action='migration'] - Operation type, affects wording.
 */
function displayFinalInstructionsHelpBanner(appPath, action = 'migration') {
  logger.info(`
------------------------------------------------------------
🏗️  Next recommended step: full monorepo build & test

To validate the ${action} is done successfully for "${appPath}"
and does not introduce side-effects across all apps, run:

   yarn build
   yarn test   # optional

This will:
   • Rebuild the entire repository with updated catalogs
   • Ensure "${appPath}" is properly ${action === 'rollback' ? 'restored' : 'integrated'}
   • Catch regressions early (type, lint, test)

⚠️  Build is manual by design to keep ${action} predictable.
------------------------------------------------------------
`);
}

/**
 * Update workspace catalogs by removing the application path
 * from one catalog and adding it to another.
 *
 * @async
 * @param {Object} params - Function parameters.
 * @param {string} params.fromPath - Source catalog path (to remove from).
 * @param {string} params.toPath - Target catalog path (to add to).
 * @param {string} params.appPath - Relative path of the application.
 * @returns {Promise<boolean>} - True if catalog update succeeded,
 *   false if skipped due to invalid workspace.
 * @throws {Error} If catalog update fails with an error status.
 */
async function updateCatalog({ fromPath, toPath, appPath }) {
  const removed = await removeAppPathFromCatalog(fromPath, appPath);
  const added = await addAppPathToCatalog(toPath, appPath);

  logger.info(`ℹ️ Catalog updates:
       • Removed from ${fromPath.includes('pnpm') ? 'PNPM' : 'Yarn'} → ${removed}
       • Added to ${toPath.includes('pnpm') ? 'PNPM' : 'Yarn'} → ${added}`);

  if (removed === 'invalid' || added === 'invalid') {
    logger.warn(`⚠️ Skipped: "${appPath}" is not a valid workspace.`);
    return false;
  }

  if (removed === 'error' || added === 'error') {
    throw new Error(`Catalog update failed for "${appPath}"`);
  }

  return true;
}

/**
 * Run `yarn install` at the repository root to refresh
 * all workspaces after migration or rollback.
 *
 * @throws {Error} If the install command fails.
 */
function runYarnInstall() {
  logger.info(`📦 Running "yarn install" to refresh root workspaces...`);
  try {
    execSync('yarn install', { stdio: 'inherit' });
    logger.success(`✔ Dependencies installed.`);
  } catch (err) {
    logger.error(`❌ "yarn install" failed: ${err.message}`);
    throw err;
  }
}

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
  displayAddHelpBanner(relAppPath);

  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogPaths();
    if (await isAppInCatalog(pnpmCatalogPath, relAppPath)) {
      logger.info(`ℹ️ App "${relAppPath}" already in PNPM. Nothing to do.`);
      return;
    }

    await normalizeReactDependencies(relAppPath);

    const success = await updateCatalog({
      fromPath: yarnCatalogPath,
      toPath: pnpmCatalogPath,
      appPath: relAppPath,
    });
    if (!success) return;

    await cleanAppDirs(relAppPath);
    await patchVitestConfig(relAppPath);

    logger.success(`✅ "${relAppPath}" is now tracked in PNPM and visible to Turbo.`);
    runYarnInstall();

    logger.success(`✔ Migration of "${relAppPath}" complete.`);
    displayFinalInstructionsHelpBanner(relAppPath, 'migration');
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
  displayRemoveHelpBanner(relAppPath);

  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogPaths();
    if (!(await isAppInCatalog(pnpmCatalogPath, relAppPath))) {
      logger.info(`ℹ️ App "${relAppPath}" not in PNPM. Nothing to do.`);
      return;
    }

    const success = await updateCatalog({
      fromPath: pnpmCatalogPath,
      toPath: yarnCatalogPath,
      appPath: relAppPath,
    });
    if (!success) return;

    await cleanAppDirs(relAppPath);

    logger.success(`✅ "${relAppPath}" is now tracked in Yarn and visible to Turbo.`);
    runYarnInstall();

    logger.success(`✔ Rollback of "${relAppPath}" complete.`);
    displayFinalInstructionsHelpBanner(relAppPath, 'rollback');
  } catch (err) {
    logger.error(`❌ Rollback failed for "${relAppPath}": ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    throw err;
  }
}
