import {
  displayAddHelpBanner,
  displayFinalInstructionsHelpBanner,
  displayRemoveHelpBanner,
} from '../commons/banner-helper.js';
import { buildApplicationWorkspacePath } from '../helpers/apps-workspace-helper.js';
import { getCatalogsPaths, isTargetInCatalog, updateCatalogs } from '../utils/catalog-utils.js';
import { normalizeCriticalDependencies } from '../utils/dependencies-utils.js';
import { logger } from '../utils/log-manager.js';
import { runYarnInstall } from '../utils/tasks-utils.js';
import { cleanArtifactDirectories } from '../utils/workspace-utils.js';
import { patchVitestConfig } from './pnpm-config-manager.js';

/**
 * Add an application to the PNPM workflow.
 *
 * Steps performed:
 *   1. Skip if app is already in PNPM catalog
 *   2. Normalize critical dependencies
 *   3. Remove the app from Yarn catalog
 *   4. Add the app to PNPM catalog
 *   5. Clean old package-manager artifacts
 *   6. Patch vitest config if needed
 *   7. Run `yarn install` automatically
 *   8. Show final build/test banner
 *
 * @param {string} appRef - Application reference (name, package name, or workspace path).
 */
export async function addApplicationToPnpm(appRef) {
  logger.debug(`addApplicationToPnpm(appRef="${appRef}")`);

  if (!appRef) throw new Error('addApplicationToPnpm: appRef is required');

  const relAppPath = buildApplicationWorkspacePath(appRef);
  displayAddHelpBanner(relAppPath);

  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogsPaths();

    if (await isTargetInCatalog(pnpmCatalogPath, relAppPath)) {
      logger.info(`ℹ️ App "${relAppPath}" already in PNPM. Nothing to do.`);
      return;
    }

    await normalizeCriticalDependencies(relAppPath);

    const success = await updateCatalogs({
      fromPath: yarnCatalogPath,
      toPath: pnpmCatalogPath,
      targetPath: relAppPath,
    });

    if (!success) return;

    await cleanArtifactDirectories(relAppPath);
    await patchVitestConfig(relAppPath);

    logger.success(`✅ "${relAppPath}" is now tracked in PNPM and visible to Turbo.`);

    runYarnInstall();

    logger.success(`✔ Migration of "${relAppPath}" complete.`);

    displayFinalInstructionsHelpBanner(relAppPath, 'migration');
  } catch (exception) {
    logger.error(`❌ Migration failed for "${relAppPath}": ${exception.message}`);
    logger.debug(`Stack trace: ${exception.stack}`);
    throw exception;
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
export async function removeApplicationFromPnpm(appRef) {
  logger.debug(`removeApplicationFromPnpm(appRef="${appRef}")`);
  if (!appRef) throw new Error('removeApplicationFromPnpm: appRef is required');

  const relAppPath = buildApplicationWorkspacePath(appRef);
  displayRemoveHelpBanner(relAppPath);

  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogsPaths();

    if (!(await isTargetInCatalog(pnpmCatalogPath, relAppPath))) {
      logger.info(`ℹ️ App "${relAppPath}" not in PNPM. Nothing to do.`);
      return;
    }

    const success = await updateCatalogs({
      fromPath: pnpmCatalogPath,
      toPath: yarnCatalogPath,
      targetPath: relAppPath,
    });

    if (!success) return;

    await cleanArtifactDirectories(relAppPath);

    logger.success(`✅ "${relAppPath}" is now tracked in Yarn and visible to Turbo.`);

    runYarnInstall();

    logger.success(`✔ Rollback of "${relAppPath}" complete.`);

    displayFinalInstructionsHelpBanner(relAppPath, 'rollback');
  } catch (exception) {
    logger.error(`❌ Rollback failed for "${relAppPath}": ${exception.message}`);
    logger.debug(`Stack trace: ${exception.stack}`);
    throw exception;
  }
}
