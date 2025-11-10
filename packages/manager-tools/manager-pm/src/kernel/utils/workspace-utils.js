import fs from 'node:fs';
import path from 'node:path';

import { cleanupDirectories, managerRootPath } from '../../playbook/playbook-config.js';
import { logger } from './log-manager.js';
import { toPosix } from './path-utils.js';

/**
 * Strip the repository root from an absolute path, returning a workspace-relative path.
 * @param {string} absolutePath - The absolute path to process.
 * @returns {string} The workspace-relative path.
 */
export function stripRepositoryRoot(absolutePath) {
  const rootPathPosix = toPosix(managerRootPath).replace(/\/+$/, '');
  const absolutePathPosix = toPosix(absolutePath);
  return absolutePathPosix.startsWith(`${rootPathPosix}/`)
    ? absolutePathPosix.slice(rootPathPosix.length + 1)
    : absolutePathPosix;
}

/**
 * Check if the provided path is likely a workspace-relative path.
 * @param {string} filePath - The path to check.
 * @returns {boolean} True if it's a workspace-relative path, otherwise false.
 */
export function isWorkspaceRelativePath(filePath) {
  const normalizedPath = toPosix(filePath);
  return normalizedPath.startsWith('packages/') || normalizedPath.startsWith('./packages/');
}

/**
 * Clean up existing build and dependency folders in an app.
 *
 * Removes:
 *  - node_modules
 *  - dist
 *  - .turbo (Turbo cache)
 *
 * @param {string} appPath - Absolute path to the app folder
 */
export async function cleanArtifactDirectories(appPath) {
  logger.debug(`cleanAppDirs(appPath="${appPath}")`);
  for (const directory of cleanupDirectories) {
    const fullPath = path.join(appPath, directory);
    try {
      await fs.rm(fullPath, { recursive: true, force: true });
      logger.info(`🧹 [cleanup] Removed ${fullPath}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : err;
      logger.warn(`⚠️ [cleanup] Failed to remove ${fullPath}: ${message}`);
    }
  }
}
