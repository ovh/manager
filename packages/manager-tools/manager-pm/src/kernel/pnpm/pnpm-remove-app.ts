import { consola } from 'consola';
import { promises as fs } from 'fs';

import { buildAppPath, migratePnpmAppsPath } from '../../playbook/pnpm-config.js';
import { addAppToYarnWorkspaces } from '../commons/workspace-utils.js';
import { parseJson } from '../utils/json-utils.js';

/**
 * Remove an app from the pnpm workflow (rollback):
 * - Removes it from pnpm-migrated-apps.json
 * - Re-adds it to Yarn root package.json workspaces
 */
export async function removeAppFromPnpm(appName: string): Promise<void> {
  const appPath = buildAppPath(appName);
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
    const error = exception as NodeJS.ErrnoException;
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

  // --- Step 2: Re-add app to Yarn workspaces (via workspace utils)
  await addAppToYarnWorkspaces(appPath);

  consola.box(`✅ App "${appName}" successfully rolled back to Yarn workflow.`);
}
