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
import {
  clearRootWorkspaces,
  getCatalogPaths,
  readCatalog,
  updateRootWorkspacesToYarnOnly,
} from '../commons/catalog-utils.js';
import { getPnpmPrivateModules, getTurboPrivateFilters } from '../commons/dependencies-utils.js';
import { loadJson } from '../commons/json-utils.js';
import { logger } from '../commons/log-manager.js';
import { removePackageManager, restorePackageManager } from '../commons/package-manager-utils.js';
import { bootstrapPnpm, getPnpmPlatformExecutablePath } from './pnpm-bootstrap.js';

/**
 * Create a temporary `pnpm-workspace.yaml` inside the app folder.
 * This file overrides dependencies so PNPM can resolve:
 * - Private packages (linked locally with `link:`),
 * - Normalized versions (forced versions for consistency).
 *
 * @param {string} appPath - Absolute path to the app being installed.
 * @param {object} appPkg - Parsed package.json of the app.
 * @param {Map<string,string>} privateDeps - Map of private package names → absolute paths.
 * @param {Record<string,string>} normalizedVersions - Map of normalized dependency versions.
 * @returns {Promise<string>} Absolute path to the temporary workspace file created.
 */
async function createPnpmWorkspaceFile(appPath, appPkg, privateDeps, normalizedVersions) {
  logger.info(`📝 [workspace] Collecting dependencies from package.json...`);

  const deps = {
    ...(appPkg.dependencies ?? {}),
    ...(appPkg.devDependencies ?? {}),
    ...(appPkg.peerDependencies ?? {}),
  };
  logger.info(`📦 [workspace] Found ${Object.keys(deps).length} deps in package.json`);

  const overrideEntries = {};

  // Always link ALL private packages
  logger.info(`🔎 [workspace] Linking all private packages...`);
  for (const [depName, depPath] of privateDeps.entries()) {
    const relativePath = path.relative(appPath, depPath);
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

  const workspacePath = path.join(appPath, 'pnpm-workspace.yaml');
  await fs.writeFile(workspacePath, yaml, 'utf-8');
  logger.success(`📝 [workspace] Created temporary ${workspacePath}`);
  return workspacePath;
}

/**
 * Prepare app context for PNPM install (package.json, normalized versions, private deps, filters).
 *
 * @param {string} appPath
 * @returns {Promise<{pkg: object, normalizedVersions: Record<string,string>, privateDeps: Map<string,string>}
 */
async function prepareAppContext(appPath) {
  logger.info(`📖 Reading ${appPath}/package.json...`);
  const pkg = await loadJson(path.join(appPath, 'package.json'));
  logger.success(`✔ Loaded package.json for app: ${pkg.name ?? '(unknown)'}`);

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
 * @param {string} appPath
 * @param {string} pnpmBin
 */
function runPnpmInstall(appPath, pnpmBin) {
  const args = [
    'install',
    '--ignore-scripts',
    '--no-lockfile',
    `--store-dir=${path.join(managerRootPath, 'target/.pnpm-store')}`,
  ];

  logger.info(`▶ Running pnpm ${args.join(' ')}`);
  execSync(`${pnpmBin} ${args.join(' ')}`, { cwd: appPath, stdio: 'inherit' });
}

/**
 * Install dependencies for a single app using PNPM.
 *
 * Steps:
 *  1. Remove `packageManager` field from root package.json
 *  2. Load app context (package.json, normalized versions, private deps, filters)
 *  3. Generate a temporary pnpm-workspace.yaml
 *  4. Run PNPM install with filters
 *  5. Clean up temporary files
 *  6. Restore `packageManager` field in root package.json
 *
 * @async
 * @function installAppDeps
 * @param {string} appPath - Absolute path to the app folder.
 * @throws {Error} If PNPM install fails.
 */
export async function installAppDeps(appPath) {
  logger.info(`🚀 Starting PNPM install for app at: ${appPath}`);
  const pnpmBin = getPnpmPlatformExecutablePath(os.platform());

  // Step 1: Remove packageManager from root
  const removedValue = await removePackageManager(rootPackageJsonPath);

  let workspaceFile = null;
  try {
    // Step 2: Load context
    const { pkg, normalizedVersions, privateDeps } = await prepareAppContext(appPath);

    // Step 3: Create temporary workspace
    workspaceFile = await createPnpmWorkspaceFile(appPath, pkg, privateDeps, normalizedVersions);

    // Step 4: Run PNPM install
    runPnpmInstall(appPath, pnpmBin);

    logger.success(`✅ PNPM install completed for ${pkg.name}`);
  } catch (err) {
    logger.error(`❌ PNPM install failed for app at ${appPath}: ${err.message}`);
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
 *   This ensures "yarn install" only touches Yarn-managed apps.
 */
export async function yarnPreInstall() {
  logger.info('🧩 Yarn preinstall: limit workspaces to Yarn catalog');
  await updateRootWorkspacesToYarnOnly();
  logger.info('✅ Root workspaces set to Yarn-only for installation.');
}

/**
 * Yarn post-install hook:
 *  - Ensure PNPM is bootstrapped locally.
 *  - Build and link private packages into PNPM store.
 *  - Install dependencies for each PNPM-catalog app via PNPM.
 *  - Restore root workspaces to the merged (Yarn ∪ PNPM) view.
 */
export async function yarnPostInstall() {
  logger.info('🧩 Yarn postinstall: bootstrap PNPM, link privates, install PNPM apps');

  try {
    await bootstrapPnpm();
    await buildPrivatePackages();

    const { pnpmCatalogPath } = getCatalogPaths();
    const pnpmApps = await readCatalog(pnpmCatalogPath);

    for (const relAppPath of pnpmApps) {
      const abs = path.isAbsolute(relAppPath) ? relAppPath : path.join(managerRootPath, relAppPath);
      await installAppDeps(abs);
    }

    logger.info(
      '🎉 Yarn postinstall complete: PNPM store ready; PNPM apps installed; workspaces restored.',
    );
  } catch (error) {
    logger.error('❌ Yarn postinstall failed:');
    logger.error(error.stack || error.message || error);
    throw error; // rethrow so CI/CD sees the failure
  } finally {
    // Always restore root workspaces, even if something went wrong
    await clearRootWorkspaces();
  }
}
