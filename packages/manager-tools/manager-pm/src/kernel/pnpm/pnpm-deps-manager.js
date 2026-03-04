import { execSync, spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  managerRootPath,
  normalizedVersionsPath,
  privateModulesPath,
  rootPackageJsonPath,
} from '../../playbook/playbook-config.js';
import { getCatalogsPaths, readCatalog } from '../utils/catalog-utils.js';
import { getPnpmPrivateModules, getTurboPrivateFilters } from '../utils/dependencies-utils.js';
import { loadJson } from '../utils/json-utils.js';
import { logger } from '../utils/log-manager.js';
import { removePackageManager, restorePackageManager } from '../utils/package-manager-utils.js';
import { injectTools } from '../utils/tools-utils.js';
import {
  clearRootWorkspaces,
  updateRootWorkspacesFromCatalogs,
  updateRootWorkspacesToYarnOnly,
} from '../utils/workspace-utils.js';
import { bootstrapPnpm, getPnpmPlatformExecutablePath } from './pnpm-bootstrap.js';

/**
 * Create a temporary `pnpm-workspace.yaml` inside the target folder.
 * This file overrides dependencies so PNPM can resolve:
 * - Private packages (linked locally with `link:`),
 * - Normalized versions (forced versions for consistency).
 *
 * @param {string} targetPath - Absolute path to the target being installed.
 * @param {object} targetPackage - Parsed package.json of the target.
 * @param {Map<string,string>} privateDeps - Map of private package names → absolute paths.
 * @param {Record<string,string>} normalizedVersions - Map of normalized dependency versions.
 * @returns {Promise<string>} Absolute path to the temporary workspace file created.
 */
async function createPnpmWorkspaceFile(targetPath, targetPackage, privateDeps, normalizedVersions) {
  logger.info(`📝 [workspace] Collecting dependencies from package.json...`);

  const deps = {
    ...(targetPackage.dependencies ?? {}),
    ...(targetPackage.devDependencies ?? {}),
    ...(targetPackage.peerDependencies ?? {}),
  };
  logger.info(`📦 [workspace] Found ${Object.keys(deps).length} deps in package.json`);

  const overrideEntries = {};

  // Always link ALL private packages
  logger.info(`🔎 [workspace] Linking all private packages...`);
  for (const [depName, depPath] of privateDeps.entries()) {
    const relativePath = path.relative(targetPath, depPath);
    overrideEntries[depName] = `link:${relativePath}`;
    logger.info(`   ↳ linked private: ${depName} → ${relativePath}`);
  }

  // Add normalized versions for public deps
  logger.info(`🔎 [workspace] Applying normalized versions...`);
  for (const [name, version] of Object.entries(normalizedVersions)) {
    if (!overrideEntries[name]) {
      overrideEntries[name] = version;
      logger.info(`   ↳ normalized: ${name} → ${version}`);
    }
  }

  // Build YAML content
  const yaml = [
    `packages:`,
    `  - .`,
    ``,
    `overrides:`,
    ...Object.entries(overrideEntries).map(([k, v]) => `  "${k}": "${v}"`),
    ``,
  ].join('\n');

  const workspacePath = path.join(targetPath, 'pnpm-workspace.yaml');
  await fs.writeFile(workspacePath, yaml, 'utf-8');
  logger.success(`📝 [workspace] Created temporary ${workspacePath}`);
  return workspacePath;
}

/**
 * Prepare target context for PNPM install (package.json, normalized versions, private deps, filters).
 *
 * @param {string} targetPath
 * @returns {Promise<{pkg: object, normalizedVersions: Record<string,string>, privateDeps: Map<string,string>}
 */
async function prepareTargetContext(targetPath) {
  logger.info(`📖 Reading ${targetPath}/package.json...`);
  const pkg = await loadJson(path.join(targetPath, 'package.json'));
  logger.success(`✔ Loaded package.json for target: ${pkg.name ?? '(unknown)'}`);

  logger.info(`📖 Loading normalized versions from: ${normalizedVersionsPath}`);
  const normalizedVersions = await loadJson(normalizedVersionsPath);
  logger.success(`✔ Loaded ${Object.keys(normalizedVersions).length} normalized versions.`);

  logger.info(`📖 Resolving private packages from catalog...`);
  const privateDeps = await getPnpmPrivateModules(privateModulesPath);
  logger.info(`   ↳ Found ${privateDeps.size} private packages`);

  return { pkg, normalizedVersions, privateDeps };
}

/**
 * Run PNPM install with provided filters.
 *
 * @param {string} targetPath
 * @param {string} pnpmBin
 */
function runPnpmInstall(targetPath, pnpmBin) {
  const args = [
    'install',
    '--ignore-scripts',
    '--no-lockfile',
    '--prefer-offline',
    `--store-dir=${path.join(managerRootPath, 'target/.pnpm-store')}`,
  ];

  logger.info(`▶ Running pnpm ${args.join(' ')}`);
  execSync(`${pnpmBin} ${args.join(' ')}`, {
    cwd: targetPath,
    stdio: 'inherit',
  });
}

/**
 * Install dependencies for a single target using PNPM.
 *
 * Steps:
 *  1. Remove `packageManager` field from root package.json
 *  2. Load target context (package.json, normalized versions, private deps, filters)
 *  3. Generate a temporary pnpm-workspace.yaml
 *  4. Run PNPM install with filters
 *  5. Clean up temporary files
 *  6. Restore `packageManager` field in root package.json
 *
 * @async
 * @function installTargetDeps
 * @param {string} targetPath - Absolute path to the target folder.
 * @throws {Error} If PNPM install fails.
 */
export async function installTargetDeps(targetPath) {
  logger.info(`🚀 Starting PNPM install for target at: ${targetPath}`);
  const pnpmBin = getPnpmPlatformExecutablePath(os.platform());

  // Step 1: Remove packageManager from root
  const removedValue = await removePackageManager(rootPackageJsonPath);

  let workspaceFile = null;
  try {
    // Step 2: Load context
    const { pkg, normalizedVersions, privateDeps } = await prepareTargetContext(targetPath);

    // Step 3: Create temporary workspace
    workspaceFile = await createPnpmWorkspaceFile(targetPath, pkg, privateDeps, normalizedVersions);

    // Step 4: Run PNPM install
    runPnpmInstall(targetPath, pnpmBin);

    logger.success(`✅ PNPM install completed for ${pkg.name}`);
  } catch (err) {
    logger.error(`❌ PNPM install failed for target at ${targetPath}: ${err.message}`);
    throw err;
  } finally {
    // Step 5: Cleanup
    if (workspaceFile) {
      try {
        await fs.unlink(workspaceFile);
        logger.info(`🧹 Removed temporary ${workspaceFile}`);
      } catch (cleanupErr) {
        logger.warn(`⚠️ Failed to remove workspace file: ${cleanupErr.message}`);
      }
    }

    // Step 6: Restore packageManager
    await restorePackageManager(rootPackageJsonPath, removedValue);
  }
}

/**
 * Build private packages using Turbo with filters loaded
 * from the pre-generated JSON file (`pnpm-private-modules.json`).
 *
 * - Reads the catalog via {@link getTurboPrivateFilters}.
 * - Appends the filters directly to Turbo CLI args.
 * - Runs `turbo run build` with concurrency 5.
 *
 * @async
 * @function buildPrivatePackages
 * @returns {Promise<void>} Resolves when the Turbo build completes.
 * @throws {Error} If the Turbo process exits with non-zero code.
 */
export async function buildPrivatePackages() {
  const filters = await getTurboPrivateFilters(privateModulesPath);
  if (filters.length === 0) {
    logger.info('ℹ No private package filters found to build.');
    return;
  }

  const args = ['run', 'build', '--concurrency=5', ...filters];
  logger.info(`▶ turbo ${args.join(' ')}`);

  await new Promise((resolve, reject) => {
    const proc = spawn('turbo', args, {
      cwd: managerRootPath,
      stdio: 'inherit', // stream Turbo logs directly
    });

    proc.on('error', (err) => {
      logger.error(`❌ Turbo process failed to start: ${err.message}`);
      reject(err);
    });
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        logger.error(`❌ Turbo build failed with exit code ${code}`);
        reject(new Error(`turbo build failed with exit code ${code}`));
      }
    });
  });

  logger.success('✔ Built private packages.');
}

/**
 * Yarn pre-install hook:
 * - Inject Yarn catalog only into root package.json workspaces.
 *   This ensures "yarn install" only touches Yarn-managed targets.
 */
export async function yarnPreInstall() {
  logger.info('🧩 Yarn preinstall: limit workspaces to Yarn catalog');
  await updateRootWorkspacesToYarnOnly();
  await injectTools();
  logger.info('✅ Root workspaces set to Yarn-only for installation.');
}

/**
 * Yarn post-install hook:
 *  - Ensure PNPM is bootstrapped locally.
 *  - Build and link private packages into PNPM store.
 *  - Install dependencies for each PNPM-catalog target via PNPM.
 *  - Restore root workspaces to the merged (Yarn ∪ PNPM) view.
 */
export async function yarnPostInstall() {
  logger.info('🧩 Yarn postinstall: bootstrap PNPM, link privates, install PNPM targets');

  try {
    const { pnpmCatalogPath } = getCatalogsPaths();
    const pnpmTargets = await readCatalog(pnpmCatalogPath);

    if (pnpmTargets?.length > 0) {
      await bootstrapPnpm();
      await updateRootWorkspacesFromCatalogs();
      await buildPrivatePackages();

      for (const relTargetPath of pnpmTargets) {
        const targetAbsolutePath = path.isAbsolute(relTargetPath)
          ? relTargetPath
          : path.join(managerRootPath, relTargetPath);
        await installTargetDeps(targetAbsolutePath);
      }

      logger.info(
        '🎉 Yarn postinstall complete: PNPM store ready; PNPM targets installed; workspaces restored.',
      );
    } else {
      logger.info('😴 No targets marked for PNPM installation found in workspace — skipping.');
    }
  } catch (error) {
    logger.error('❌ Yarn postinstall failed:');
    logger.error(error.stack || error.message || error);
    throw error; // rethrow so CI/CD sees the failure
  } finally {
    // Always restore root workspaces, even if something went wrong
    await clearRootWorkspaces();
  }
}
