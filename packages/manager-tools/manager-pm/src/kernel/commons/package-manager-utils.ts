import { consola } from 'consola';
import { promises as fs } from 'node:fs';

/**
 * Remove the `packageManager` field from root package.json.
 *
 * @param pkgPath Absolute path to root package.json
 * @returns The removed value, or null if nothing was removed
 */
export async function removePackageManager(pkgPath: string): Promise<string | null> {
  const raw = await fs.readFile(pkgPath, 'utf-8');
  const pkgJson = JSON.parse(raw) as Record<string, unknown>;

  if (!pkgJson.packageManager) {
    consola.info('ℹ No `packageManager` field found in root package.json, nothing to remove.');
    return null;
  }

  const original = pkgJson.packageManager as string;
  delete pkgJson.packageManager;

  await fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2));
  consola.info(`🗑 Removed \`packageManager\` ("${original}") from root package.json`);
  return original;
}

/**
 * Restore the `packageManager` field in root package.json.
 *
 * @param pkgPath Absolute path to root package.json
 * @param value Value to restore (ignored if null)
 */
export async function restorePackageManager(pkgPath: string, value: string | null): Promise<void> {
  if (!value) {
    consola.info('ℹ No `packageManager` to restore, skipping.');
    return;
  }

  try {
    const raw = await fs.readFile(pkgPath, 'utf-8');
    const pkgJson = JSON.parse(raw) as Record<string, unknown>;

    pkgJson.packageManager = value;
    await fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2));

    consola.info(`♻️ Restored \`packageManager\` ("${value}") in root package.json`);
  } catch (err) {
    consola.warn(`⚠️ Failed to restore packageManager: ${(err as Error).message}`);
  }
}
