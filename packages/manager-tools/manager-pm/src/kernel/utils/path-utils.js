import path from 'node:path';

import { managerRootPath } from '../../playbook/playbook-config.js';

/**
 * Convert a filesystem path into POSIX format (forward slashes).
 */
export function toPosix(p) {
  return p.split(path.sep).join(path.posix.sep);
}

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
