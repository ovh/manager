import { promises as fs } from 'node:fs';

import { logger } from './log-manager.js';

/**
 * Load and parse a JSON file into a typed object.
 *
 * @template T - The expected type of the parsed JSON object.
 * @param {string} filePath - Absolute or relative path to the JSON file.
 * @returns {Promise<T>} A promise resolving to the parsed object, typed as `T`.
 *
 * @throws Will throw if the file cannot be read or contains invalid JSON.
 *
 * @example
 * ```ts
 * interface Config {
 *   port: number;
 *   debug: boolean;
 * }
 *
 * const config = await loadJson<Config>('./config.json');
 * console.log(config.port);
 * ```
 */
export async function loadJson(filePath) {
  logger.debug(`loadJson(file="${filePath}")`);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    logger.info(`✅ Successfully loaded JSON from ${filePath}`);
    logger.debug(
      `Sample keys: ${Object.keys(parsed).slice(0, 5).join(', ')}${
        Object.keys(parsed).length > 5 ? ' ...' : ''
      }`,
    );
    return parsed;
  } catch (err) {
    logger.error(`❌ Failed to load JSON file ${filePath}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    throw err;
  }
}

/**
 * Safely write a JavaScript object to a JSON file.
 *
 * - Pretty-prints with 2 spaces.
 * - Ensures atomic write: first writes to a temp file, then renames.
 * - Logs summary including file size and sample keys.
 *
 * @template T
 * @param {string} filePath - Path to the target JSON file.
 * @param {T} data - Serializable object to write.
 * @returns {Promise<void>}
 *
 * @throws Will throw if serialization or file write fails.
 *
 * @example
 * ```ts
 * await writeJson('./config.json', { port: 3000, debug: true });
 * ```
 */
export async function writeJson(filePath, data) {
  logger.debug(`writeJson(file="${filePath}")`);

  try {
    const serialized = JSON.stringify(data, null, 2);
    const tempPath = `${filePath}.tmp`;

    // Write to a temp file first
    await fs.writeFile(tempPath, serialized, 'utf8');

    // Atomically replace the original
    await fs.rename(tempPath, filePath);

    logger.info(`✅ JSON written successfully to ${filePath}`);
    if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      logger.debug(`Sample keys: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? ' ...' : ''}`);
    }
  } catch (err) {
    logger.error(`❌ Failed to write JSON to ${filePath}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    throw err;
  }
}
