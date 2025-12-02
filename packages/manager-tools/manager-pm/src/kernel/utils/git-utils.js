import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { logger } from './log-manager.js';

const execAsync = promisify(exec);

/**
 * Try to restore package.json from Git.
 *
 * @param {string} directory - Directory containing package.json
 * @param {string} file - Filename of package.json
 * @returns {Promise<boolean>} True if restored successfully
 */
export async function tryGitRestore(directory, file) {
  try {
    logger.info(`Attempting to restore ${file} using Git...`);
    await execAsync(`git restore ${file}`, { cwd: directory });
    logger.success(`✔ Successfully restored ${file} from Git`);
    return true;
  } catch (err) {
    logger.warn(`⚠️ Git restore failed: ${err.message}`);
    logger.debug(`Git error stack: ${err.stack}`);
    return false;
  }
}
