import { consola } from 'consola';
import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  managerRootPath,
  normalizedVersionsPath,
  pnpmExecutablePath,
  rootPackageJsonPath,
} from '../../playbook/pnpm-config.js';
import { getPrivatePackages } from '../commons/dependencies-utils.js';
import { loadJson } from '../commons/json-utils.js';
import { removePackageManager, restorePackageManager } from '../commons/package-manager-utils.js';
import { cleanAppDirs } from '../commons/workspace-utils.js';
import { PackageJsonType } from '../types/commons/package-json-type.js';

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
async function createWorkspaceYaml(
  appPath: string,
  appPkg: PackageJsonType,
  privateDeps: Map<string, string>,
  normalizedVersions: Record<string, string>,
): Promise<string> {
  consola.info(`📝 [workspace] Collecting dependencies from package.json...`);

  const deps: Record<string, string> = {
    ...(appPkg.dependencies ?? {}),
    ...(appPkg.devDependencies ?? {}),
    ...(appPkg.peerDependencies ?? {}),
  };
  consola.info(`📦 [workspace] Found ${Object.keys(deps).length} deps in package.json`);

  const overrideEntries: Record<string, string> = {};

  // Handle private packages
  consola.start(`🔎 [workspace] Checking for private package links...`);
  for (const depName of Object.keys(deps)) {
    if (privateDeps.has(depName)) {
      const depPath = privateDeps.get(depName)!;
      const relativePath = path.relative(appPath, depPath);
      overrideEntries[depName] = `link:${relativePath}`;
      consola.info(`   ↳ linked private: ${depName} → ${relativePath}`);
    }
  }

  // Handle normalized versions
  consola.start(`🔎 [workspace] Applying normalized versions...`);
  for (const [name, version] of Object.entries(normalizedVersions)) {
    if (!overrideEntries[name]) {
      overrideEntries[name] = version;
      consola.info(`   ↳ normalized: ${name} → ${version}`);
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
  consola.success(`📝 [workspace] Created temporary ${workspacePath}`);
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
export async function installAppDeps(appPath: string): Promise<void> {
  consola.start(`🚀 Starting PNPM install for app at: ${appPath}`);

  // --- Pre-step: Cleanup
  await cleanAppDirs(appPath);

  // --- Step 1: Remove packageManager from root
  const removedValue = await removePackageManager(rootPackageJsonPath);

  // --- Step 2: Load app package.json
  consola.info(`📖 [step 2] Reading ${appPath}/package.json...`);
  const pkg = await loadJson<PackageJsonType>(path.join(appPath, 'package.json'));
  consola.success(`✔ Loaded package.json for app: ${pkg.name ?? '(unknown)'}`);

  // --- Step 3: Load normalized versions
  consola.info(`📖 [step 3] Loading normalized versions from: ${normalizedVersionsPath}`);
  const normalizedVersions = await loadJson<Record<string, string>>(normalizedVersionsPath);
  consola.success(`✔ Loaded ${Object.keys(normalizedVersions).length} normalized versions.`);

  // --- Step 4: Build privateDeps map
  consola.info(`📖 [step 4] Resolving private packages...`);
  const privateDeps = new Map<string, string>();
  const privateDirs = await getPrivatePackages();
  consola.info(`   ↳ Found ${privateDirs.length} private package dirs`);
  for (const dir of privateDirs) {
    const raw = await fs.readFile(path.join(dir, 'package.json'), 'utf-8');
    const pkgJson = JSON.parse(raw) as PackageJsonType;
    if (pkgJson.name) {
      privateDeps.set(pkgJson.name, dir);
      consola.info(`   ↳ private package detected: ${pkgJson.name}`);
    }
  }

  // --- Step 5: Create temporary workspace
  let workspaceFile: string | null = null;
  try {
    consola.info(`📖 [step 5] Creating temporary pnpm-workspace.yaml...`);
    workspaceFile = await createWorkspaceYaml(appPath, pkg, privateDeps, normalizedVersions);

    // --- Step 6: Run PNPM install
    consola.info(`📖 [step 6] Running PNPM install...`);
    execSync(
      `${pnpmExecutablePath} install --ignore-scripts --no-lockfile --store-dir=${path.join(managerRootPath, 'target/.pnpm-store')}`,
      { cwd: appPath, stdio: 'inherit' },
    );

    consola.success(`✅ PNPM install completed for ${pkg.name}`);
  } catch (err) {
    consola.error(`❌ PNPM install failed for ${pkg.name}:`, (err as Error).message);
    throw err;
  } finally {
    // --- Step 7: Cleanup temporary workspace
    if (workspaceFile) {
      try {
        await fs.unlink(workspaceFile);
        consola.info(`🧹 [cleanup] Removed temporary ${workspaceFile}`);
      } catch {
        consola.warn(`⚠️ [cleanup] Failed to remove temporary workspace file`);
      }
    }

    // --- Step 8: Restore packageManager no matter what
    await restorePackageManager(rootPackageJsonPath, removedValue);
  }
}
