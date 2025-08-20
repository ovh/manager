import { consola } from 'consola';
import { promises as fs } from 'fs';

import { buildAppPath, migratePnpmAppsPath } from '../../playbook/pnpm-config.js';
import { removeAppFromYarnWorkspaces } from '../commons/workspace-utils.js';
import { parseJson } from '../utils/json-utils.js';

/**
 * Add an app to the pnpm workflow:
 * - Removes it from Yarn root package.json workspaces (via workspace utils)
 * - Adds it to pnpm-migrated-apps.json
 *
 * @param appName - The name of the app folder under packages/manager/apps/
 */
export async function addAppToPnpm(appName: string): Promise<void> {
  const appPath = buildAppPath(appName);

  consola.start(`🚀 Starting migration for app "${appName}"`);

  // --- Step 1: Remove from Yarn workspaces
  await removeAppFromYarnWorkspaces(appPath);

  // --- Step 2: Update pnpm-migrated-apps.json
  consola.info(`📖 Reading pnpm-migrated-apps.json from: ${migratePnpmAppsPath}`);
  let pnpmApps: string[] = [];

  try {
    const pnpmRaw = await fs.readFile(migratePnpmAppsPath, 'utf-8');
    if (pnpmRaw.trim().length > 0) {
      pnpmApps = parseJson<string[]>(pnpmRaw);
      consola.success(`✔ Loaded existing pnpm-migrated-apps.json with ${pnpmApps.length} apps.`);
    } else {
      consola.warn('⚠ pnpm-migrated-apps.json is empty. Starting fresh.');
    }
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
