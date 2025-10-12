import { promises as fs } from 'node:fs';

import { logger } from './log-manager.js';

/**
 * Remove the `packageManager` field from root package.json.
 *
 * @param {string} pkgPath - Absolute path to root package.json
 * @returns {Promise<string|null>} The removed value, or null if nothing was removed
 */
export async function removePackageManager(pkgPath) {
  logger.debug(`removePackageManager(pkgPath="${pkgPath}")`);
  try {
    const raw = await fs.readFile(pkgPath, 'utf-8');
    const pkgJson = JSON.parse(raw);

    if (!pkgJson.packageManager) {
      logger.info('ℹ No `packageManager` field found in root package.json, nothing to remove.');
      return null;
    }

    const original = pkgJson.packageManager;
    delete pkgJson.packageManager;

    await fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2));
    logger.success(`🗑 Removed \`packageManager\` ("${original}") from root package.json`);
    logger.debug(`File updated at: ${pkgPath}`);
    return original;
  } catch (err) {
    logger.error(`❌ Failed to remove packageManager from ${pkgPath}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return null;
  }
}

/**
 * Restore the `packageManager` field in root package.json.
 *
 * @param {string} pkgPath - Absolute path to root package.json
 * @param {string|null} value - Value to restore (ignored if null)
 * @returns {Promise<void>}
 */
export async function restorePackageManager(pkgPath, value) {
  logger.debug(`restorePackageManager(pkgPath="${pkgPath}", value="${value}")`);
  if (!value) {
    logger.info('ℹ No `packageManager` to restore, skipping.');
    return;
  }

  try {
    const raw = await fs.readFile(pkgPath, 'utf-8');
    const pkgJson = JSON.parse(raw);

    pkgJson.packageManager = value;
    await fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2));

    logger.success(`♻️ Restored \`packageManager\` ("${value}") in root package.json`);
    logger.debug(`File updated at: ${pkgPath}`);
  } catch (err) {
    logger.error(`❌ Failed to restore packageManager in ${pkgPath}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
  }
}
