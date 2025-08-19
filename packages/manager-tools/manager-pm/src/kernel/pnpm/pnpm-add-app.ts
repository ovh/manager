import { consola } from 'consola';
import { promises as fs } from 'fs';

import { migratePnpmAppsPath, rootPackageJsonPath } from '../../playbook/pnpm-config.js';
import { JsonType } from '../types/commons/json-type.js';
import { parseJson } from '../utils/json-utils.js';

/**
 * Add an app to the pnpm workflow:
 * - Removes it from Yarn root package.json workspaces
 * - Adds it to pnpm-migrated-apps.json
 *
 * @param appName - The name of the app folder under packages/manager/apps/
 */
export async function addAppToPnpm(appName: string): Promise<void> {
  const appPath = `packages/manager/apps/${appName}`;

  consola.start(`🚀 Starting migration for app "${appName}"`);

  // --- Step 1: Read and update root package.json
  consola.info(`📖 Reading root package.json from: ${rootPackageJsonPath}`);
  const pkgRaw = await fs.readFile(rootPackageJsonPath, 'utf-8');
  consola.success(`✔ Successfully read root package.json`);

  const pkg = parseJson<JsonType>(pkgRaw);
  consola.info(`🔍 Validating Yarn workspaces...`);

  if (!pkg.workspaces?.packages) {
    consola.error(
      '❌ Error: `workspaces.packages` not found in root package.json. Are you sure this is a Yarn workspace?',
    );
    process.exit(1);
  }

  consola.info(`📂 Found ${pkg.workspaces.packages.length} workspace entries.`);

  if (!pkg.workspaces.packages.some((entry: string) => entry === appPath)) {
    consola.error(
      `❌ Error: App "${appName}" not found in Yarn workspaces.\n👉 This usually means your branch is not up to date with the monorepo root.`,
    );
    process.exit(1);
  }

  consola.info(`🗑 Removing "${appPath}" from Yarn workspaces...`);
  pkg.workspaces.packages = pkg.workspaces.packages.filter((entry: string) => entry !== appPath);

  await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
  consola.success(`✔ Removed "${appPath}" from Yarn workspaces.`);

  // --- Step 2: Update pnpm-migrated-apps.json
  consola.info(`📖 Reading pnpm-migrated-apps.json from: ${migratePnpmAppsPath}`);
  let pnpmApps: string[] = [];
  try {
    const pnpmRaw = await fs.readFile(migratePnpmAppsPath, 'utf-8');
    pnpmApps = parseJson<string[]>(pnpmRaw);
    consola.success(`✔ Loaded existing pnpm-migrated-apps.json with ${pnpmApps.length} apps.`);
  } catch {
    consola.warn('⚠ pnpm-migrated-apps.json not found, creating a new one.');
  }

  consola.info(`➕ Adding "${appName}" to pnpm-migrated-apps.json...`);
  if (!pnpmApps.includes(appName)) {
    pnpmApps.push(appName);
    await fs.writeFile(migratePnpmAppsPath, JSON.stringify(pnpmApps, null, 2));
    consola.success(`✔ Added "${appName}" to pnpm-migrated-apps.json.`);
  } else {
    consola.info(`ℹ "${appName}" is already listed in pnpm-migrated-apps.json.`);
  }

  consola.box(`✅ App "${appName}" successfully migrated to pnpm workflow.`);
}
