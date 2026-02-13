import { promises as fs } from 'node:fs';

/**
 * Check whether a file exists.
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
export async function isFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
