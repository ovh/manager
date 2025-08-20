import { execSync, spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

import {
  managerRootPath,
  normalizedVersionsPath,
  pnpmExecutablePath,
  pnpmStorePath,
  rootPackageJsonPath,
} from "../../playbook/pnpm-config.js";
import {
  getCatalogPaths,
  readCatalog,
  updateRootWorkspacesFromCatalogs,
  updateRootWorkspacesToYarnOnly,
} from "../commons/catalog-utils.js";
import { getPrivatePackages } from "../commons/dependencies-utils.js";
import { loadJson } from "../commons/json-utils.js";
import { removePackageManager, restorePackageManager } from "../commons/package-manager-utils.js";
import { cleanAppDirs } from "../commons/workspace-utils.js";
import { bootstrapPnpm } from "./pnpm-bootstrap.js";
import { logger } from "../commons/log-manager.js";

/**
 * Link all private packages into the local PNPM store (`./target`).
 *
 * - Scans core/modules/components for private packages.
 * - Runs `pnpm link --dir ./target` in each private package.
 * - Does **not** topo-sort (since `pnpm link` does not install).
 */
export async function linkPrivateDeps() {
  logger.info('🔍 Scanning for private packages...');
  const privatePackageDirs = await getPrivatePackages();
  logger.info(`Found ${privatePackageDirs.length} private packages.`);

  for (const packageDir of privatePackageDirs) {
    const packageJsonPath = path.join(packageDir, 'package.json');
    const raw = await fs.readFile(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(raw);

    if (!pkg.name) continue;

    logger.info(`🔗 Linking ${pkg.name} from ${packageDir} into local store...`);

    try {
      execSync(`pnpm link --dir ${pnpmStorePath}`, {
        cwd: packageDir,
        stdio: 'inherit',
      });
      logger.success(`✔ Linked ${pkg.name}`);
    } catch (e) {
      logger.error(`❌ Failed to link ${pkg.name}:`, e.message);
    }
  }

  logger.info(`✅ All private packages linked into ${pnpmStorePath}`);
}

/**
 * Create a temporary `pnpm-workspace.yaml` inside the app folder.
 * This file overrides dependencies so PNPM can resolve:
 * - Private packages (linked locally with `link:`),
 * - Normalized versions (forced versions for consistency).
 *
 * @param appPath - Absolute path to the app being installed.
 * @param appPkg - Parsed package.json of the app.
 * @param privateDeps - Map of private package names → absolute paths.
 * @param normalizedVersions - Map of normalized dependency versions.
 * @returns Absolute path to the temporary workspace file created.
 */
async function createWorkspaceYaml(appPath, appPkg, privateDeps, normalizedVersions) {
  logger.info(`📝 [workspace] Collecting dependencies from package.json...`);

  const deps = {
    ...(appPkg.dependencies ?? {}),
    ...(appPkg.devDependencies ?? {}),
    ...(appPkg.peerDependencies ?? {}),
  };
  logger.info(`📦 [workspace] Found ${Object.keys(deps).length} deps in package.json`);

  const overrideEntries = {};

  // Handle private packages
  logger.info(`🔎 [workspace] Checking for private package links...`);
  for (const depName of Object.keys(deps)) {
    if (privateDeps.has(depName)) {
      const depPath = privateDeps.get(depName);
      const relativePath = path.relative(appPath, depPath);
      overrideEntries[depName] = `link:${relativePath}`;
      logger.info(`   ↳ linked private: ${depName} → ${relativePath}`);
    }
  }

  // Handle normalized versions
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
 * Install dependencies for a single app using PNPM.
 *
 * Steps:
 *  1. Remove `packageManager` field from root package.json
 *  2. Load the app’s package.json
 *  3. Load normalized versions registry
 *  4. Build a map of private packages
 *  5. Generate a temporary pnpm-workspace.yaml
 *  6. Run PNPM install
 *  7. Clean up temporary files
 *  8. Restore `packageManager` field in root package.json
 *
 * @param appPath - Absolute path to the app folder
 * @throws If PNPM install fails
 */
export async function installAppDeps(appPath) {
  logger.info(`🚀 Starting PNPM install for app at: ${appPath}`);

  // --- Pre-step: Cleanup
  await cleanAppDirs(appPath);

  // --- Step 1: Remove packageManager from root
  const removedValue = await removePackageManager(rootPackageJsonPath);

  // --- Step 2: Load app package.json
  logger.info(`📖 [step 2] Reading ${appPath}/package.json...`);
  const pkg = await loadJson(path.join(appPath, 'package.json'));
  logger.success(`✔ Loaded package.json for app: ${pkg.name ?? '(unknown)'}`);

  // --- Step 3: Load normalized versions
  logger.info(`📖 [step 3] Loading normalized versions from: ${normalizedVersionsPath}`);
  const normalizedVersions = await loadJson(normalizedVersionsPath);
  logger.success(`✔ Loaded ${Object.keys(normalizedVersions).length} normalized versions.`);

  // --- Step 4: Build privateDeps map
  logger.info(`📖 [step 4] Resolving private packages...`);
  const privateDeps = new Map();
  const privateDirs = await getPrivatePackages();
  logger.info(`   ↳ Found ${privateDirs.length} private package dirs`);
  for (const dir of privateDirs) {
    const raw = await fs.readFile(path.join(dir, 'package.json'), 'utf-8');
    const pkgJson = JSON.parse(raw);
    if (pkgJson.name) {
      privateDeps.set(pkgJson.name, dir);
      logger.info(`   ↳ private package detected: ${pkgJson.name}`);
    }
  }

  // --- Step 5: Create temporary workspace
  let workspaceFile = null;
  try {
    logger.info(`📖 [step 5] Creating temporary pnpm-workspace.yaml...`);
    workspaceFile = await createWorkspaceYaml(appPath, pkg, privateDeps, normalizedVersions);

    // --- Step 6: Run PNPM install
    logger.info(`📖 [step 6] Running PNPM install...`);
    execSync(
      `${pnpmExecutablePath} install --ignore-scripts --no-lockfile --store-dir=${path.join(managerRootPath, 'target/.pnpm-store')}`,
      { cwd: appPath, stdio: 'inherit' },
    );

    logger.success(`✅ PNPM install completed for ${pkg.name}`);
  } catch (err) {
    logger.error(`❌ PNPM install failed for ${pkg.name}:`, err.message);
    throw err;
  } finally {
    // --- Step 7: Cleanup temporary workspace
    if (workspaceFile) {
      try {
        await fs.unlink(workspaceFile);
        logger.info(`🧹 [cleanup] Removed temporary ${workspaceFile}`);
      } catch {
        logger.warn(`⚠️ [cleanup] Failed to remove temporary workspace file`);
      }
    }

    // --- Step 8: Restore packageManager no matter what
    await restorePackageManager(rootPackageJsonPath, removedValue);
  }
}

/**
 * Internal: build all private packages (core/modules/components) so that their "dist"
 * exists before linking them into the PNPM local store.
 */
async function buildPrivatePackages() {
  const privateDirs = await getPrivatePackages();
  if (privateDirs.length === 0) {
    logger.info("ℹ No private packages found to build.");
    return;
  }

  const filters = [];
  for (const dir of privateDirs) {
    try {
      const raw = await fs.readFile(path.join(dir, "package.json"), "utf-8");
      const pkg = JSON.parse(raw);
      if (pkg.name) filters.push("--filter", pkg.name);
    } catch {
      /* ignore invalid package.json */
    }
  }

  if (filters.length === 0) {
    logger.info("ℹ No resolvable private package names found to build.");
    return;
  }

  const args = ["run", "build", "--concurrency=5", ...filters];
  logger.info(`▶ turbo ${args.join(" ")}`);

  await new Promise((resolve, reject) => {
    const proc = spawn("turbo", args, {
      cwd: managerRootPath,
      stdio: "inherit", // pipe output directly to terminal
    });

    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`turbo build failed with exit code ${code}`));
      }
    });
  });

  logger.success("✔ Built private packages.");
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

  await bootstrapPnpm();
  await buildPrivatePackages();
  await linkPrivateDeps();

  const { pnpmCatalogPath } = getCatalogPaths();
  const pnpmApps = await readCatalog(pnpmCatalogPath);

  for (const relAppPath of pnpmApps) {
    const abs = path.isAbsolute(relAppPath) ? relAppPath : path.join(managerRootPath, relAppPath);
    await installAppDeps(abs);
  }

  await updateRootWorkspacesFromCatalogs();
  logger.info(
    '🎉 Yarn postinstall complete: PNPM store ready; PNPM apps installed; workspaces restored.',
  );
}
