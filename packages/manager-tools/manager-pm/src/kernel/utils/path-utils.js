import path from 'node:path';

/**
 * Convert a filesystem path into POSIX format (forward slashes).
 */
export function toPosix(p) {
  return p.split(path.sep).join(path.posix.sep);
}
