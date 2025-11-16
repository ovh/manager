import {
  displayAddHelpBanner,
  displayFinalInstructionsHelpBanner,
  displayRemoveHelpBanner,
} from '../commons/banner-helper.js';
import {
  buildModuleWorkspacePath,
  getPackageNameFromModule,
} from '../helpers/modules-workspace-helper.js';
import {
  addPrivateModuleToCatalog,
  getCatalogsPaths,
  isTargetInCatalog,
  removePrivateModuleFromCatalog,
  updateCatalogs,
} from '../utils/catalog-utils.js';
import { normalizeCriticalDependencies } from '../utils/dependencies-utils.js';
import { logger } from '../utils/log-manager.js';
import { runYarnInstall } from '../utils/tasks-utils.js';
import { cleanArtifactDirectories } from '../utils/workspace-utils.js';

/**
 * Add a module to the PNPM workflow.
 *
 * Steps performed:
 *   1. Skip if module is already in PNPM catalog
 *   2. Normalize critical dependencies
 *   3. Remove the module from Yarn catalog
 *   4. Add the module to PNPM catalog
 *   5. Clean old package-manager artifacts
 *   6. Run `yarn install` automatically
 *   7. Show final build/test banner
 *
 * @param {string} moduleRef - Module reference (name, package name, or workspace path).
 * @param {boolean} isPrivate - Define if the module is private or not
 */
export async function addModuleToPnpm(moduleRef, { isPrivate = false } = {}) {
  logger.debug(`addModuleToPnpm(moduleRef="${moduleRef}", isPrivate=${isPrivate})`);

  if (!moduleRef) throw new Error('addModuleToPnpm: moduleRef is required');

  const relModulePath = buildModuleWorkspacePath(moduleRef);
  displayAddHelpBanner(relModulePath);

  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogsPaths();

    if (await isTargetInCatalog(pnpmCatalogPath, relModulePath)) {
      logger.info(`ℹ️ Module "${relModulePath}" already in PNPM. Nothing to do.`);
      return;
    }

    await normalizeCriticalDependencies(relModulePath);

    const success = await updateCatalogs({
      fromPath: yarnCatalogPath,
      toPath: pnpmCatalogPath,
      targetPath: relModulePath,
    });

    if (!success) return;

    if (isPrivate) {
      const packageName = await getPackageNameFromModule(relModulePath);
      const turboFilter = `--filter ${packageName}`;
      await addPrivateModuleToCatalog({
        turboFilter,
        pnpmPath: relModulePath,
      });
    }

    await cleanArtifactDirectories(relModulePath);

    logger.success(`✅ "${relModulePath}" is now tracked in PNPM and visible to Turbo.`);

    runYarnInstall();

    logger.success(`✔ Migration of "${relModulePath}" complete.`);

    displayFinalInstructionsHelpBanner(relModulePath, 'migration');
  } catch (exception) {
    logger.error(`❌ Migration failed for "${relModulePath}": ${exception.message}`);
    logger.debug(`Stack trace: ${exception.stack}`);
    throw exception;
  }
}

/**
 * Remove a module from the PNPM workflow (rollback to Yarn).
 *
 * Steps performed:
 *   1. Skip if module is not in PNPM catalog
 *   2. Remove the module from PNPM catalog
 *   3. Add the module back to Yarn catalog
 *   4. Clean PNPM-specific artifacts
 *   5. Run `yarn install` automatically
 *   6. Show final build/test banner
 *
 * @param {string} moduleRef - Module reference (name, package name, or workspace path).
 * @param {boolean} isPrivate - Define if the module is private or not
 */
export async function removeModuleFromPnpm(moduleRef, { isPrivate = false } = {}) {
  logger.debug(`removeModuleFromPnpm(moduleRef="${moduleRef}", isPrivate=${isPrivate})`);

  if (!moduleRef) throw new Error('removeModuleFromPnpm: moduleRef is required');

  const relModulePath = buildModuleWorkspacePath(moduleRef);
  displayRemoveHelpBanner(relModulePath);

  try {
    const { pnpmCatalogPath, yarnCatalogPath } = getCatalogsPaths();

    if (!(await isTargetInCatalog(pnpmCatalogPath, relModulePath))) {
      logger.info(`ℹ️ Module "${relModulePath}" not in PNPM. Nothing to do.`);
      return;
    }

    const success = await updateCatalogs({
      fromPath: pnpmCatalogPath,
      toPath: yarnCatalogPath,
      targetPath: relModulePath,
    });

    if (!success) return;

    if (isPrivate) {
      const packageName = await getPackageNameFromModule(relModulePath);
      const turboFilter = `--filter ${packageName}`;
      await removePrivateModuleFromCatalog({
        turboFilter,
        pnpmPath: relModulePath,
      });
    }

    await cleanArtifactDirectories(relModulePath);

    logger.success(`✅ "${relModulePath}" is now tracked in Yarn and visible to Turbo.`);

    runYarnInstall();

    logger.success(`✔ Rollback of "${relModulePath}" complete.`);

    displayFinalInstructionsHelpBanner(relModulePath, 'rollback');
  } catch (exception) {
    logger.error(`❌ Rollback failed for "${relModulePath}": ${exception.message}`);
    logger.debug(`Stack trace: ${exception.stack}`);
    throw exception;
  }
}
