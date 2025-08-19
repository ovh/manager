import { consola } from 'consola';
import { promises as fs } from 'fs';

import { migratePnpmAppsPath, rootPackageJsonPath } from '../../playbook/pnpm-config.js';
import { JsonType } from '../types/commons/json-type.js';
import { parseJson } from '../utils/json-utils.js';

/**
 * Remove an app from the pnpm workflow (rollback):
 * - Removes it from pnpm-migrated-apps.json
 * - Re-adds it to Yarn root package.json workspaces
 */
// eslint-disable-next-line max-lines-per-function
export async function removeAppFromPnpm(appName: string): Promise<void> {
  const appPath = `packages/manager/apps/${appName}`;
  consola.start(`🚀 Starting rollback for app "${appName}"`);

  // --- Step 1: Update pnpm-migrated-apps.json
  consola.info(`📖 Reading pnpm-migrated-apps.json from: ${migratePnpmAppsPath}`);
  let pnpmApps: string[] = [];
  try {
    const pnpmRaw = await fs.readFile(migratePnpmAppsPath, 'utf-8');

    if (pnpmRaw.trim().length === 0) {
      consola.warn('⚠ pnpm-migrated-apps.json is empty. Treating as no migrated apps.');
      pnpmApps = [];
    } else {
      pnpmApps = parseJson<string[]>(pnpmRaw);
      consola.success(`✔ Loaded pnpm-migrated-apps.json with ${pnpmApps.length} apps.`);
    }
  } catch (exception: unknown) {
    const error = exception as NodeJS.ErrnoException; // ✅ type-safe
    if (error.code === 'ENOENT') {
      consola.error('❌ Error: pnpm-migrated-apps.json not found. Nothing to rollback.');
    } else {
      consola.error(`❌ Failed to read pnpm-migrated-apps.json: ${error.message}`);
    }
    process.exit(1);
  }

  if (!pnpmApps.includes(appName)) {
    consola.error(
      `❌ Error: App "${appName}" not found in pnpm-migrated-apps.json.\n👉 This usually means it was never migrated.`,
    );
    process.exit(1);
  }

  consola.info(`🗑 Removing "${appName}" from pnpm-migrated-apps.json...`);
  pnpmApps = pnpmApps.filter((entry) => entry !== appName);
  await fs.writeFile(migratePnpmAppsPath, JSON.stringify(pnpmApps, null, 2));
  consola.success(`✔ Removed "${appName}" from pnpm-migrated-apps.json.`);

  // --- Step 2: Re-add app to Yarn root package.json workspaces
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
  if (pkg.workspaces.packages.includes(appPath)) {
    consola.warn(`ℹ App "${appName}" already exists in Yarn workspaces, skipping re-add.`);
  } else {
    consola.info(`➕ Re-adding "${appPath}" to Yarn workspaces...`);
    pkg.workspaces.packages.push(appPath);
    pkg.workspaces.packages.sort();
    await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
    consola.success(`✔ Re-added "${appPath}" to Yarn workspaces.`);
  }

  consola.box(`✅ App "${appName}" successfully rolled back to Yarn workflow.`);
}
