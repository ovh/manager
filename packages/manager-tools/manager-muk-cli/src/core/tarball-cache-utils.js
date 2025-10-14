import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import https from 'node:https';
import { createGunzip } from 'node:zlib';
import tar from 'tar-stream';

import { logger } from '../utils/log-manager.js';
import { loadJson, saveJson } from './file-utils.js';

/**
 * Ensure that a directory exists, creating it recursively if missing.
 * @param {string} dir - Directory path to create.
 */
export function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Compute a SHA256 checksum for an object or string.
 * @param {object|string} obj - Data to hash.
 * @returns {string} SHA256 hex digest.
 */
export function computeChecksum(obj) {
  return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
}

/**
 * Stream and extract a remote `.tar.gz` file, calling a handler for each matched file.
 * Handles redirects transparently.
 *
 * @param {string} url - Remote tarball URL.
 * @param {(entryPath: string) => boolean} filter - Predicate selecting entries to extract.
 * @param {(entryPath: string, content: Buffer) => Promise<void>} onFile - Async handler for file contents.
 * @returns {Promise<void>} Resolves when extraction completes.
 */
export async function streamTarGz(url, filter, onFile) {
  await new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'manager-muk-cli' } }, (res) => {
        // Handle HTTP redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          streamTarGz(res.headers.location, filter, onFile).then(resolve).catch(reject);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Download failed: ${res.statusCode}`));
          return;
        }

        const gunzip = createGunzip();
        const extract = tar.extract();

        extract.on('entry', (header, stream, next) => {
          const entryPath = header.name;
          if (header.type === 'file' && filter(entryPath)) {
            const chunks = [];
            stream.on('data', (c) => chunks.push(c));
            stream.on('end', async () => {
              try {
                await onFile(entryPath, Buffer.concat(chunks));
                next();
              } catch (e) {
                reject(e);
              }
            });
          } else {
            stream.resume();
            stream.on('end', next);
          }
        });

        extract.on('finish', resolve);
        extract.on('error', reject);
        gunzip.on('error', reject);

        res.pipe(gunzip).pipe(extract);
      })
      .on('error', reject);
  });
}

/**
 * @typedef {object} TarballCacheConfig
 * @property {string} cacheDir - Directory to store cache files.
 * @property {string} metaFile - Path to metadata JSON file.
 * @property {string} dataFile - Path to cached data JSON file.
 */

/**
 * Create a functional tarball cache handler.
 * Provides save/load/clear operations for extracted tarball data.
 *
 * @param {TarballCacheConfig} config - Cache directory and file paths.
 * @returns {{
 *   save: (version: string, filesMap: Map<string,string>) => void,
 *   load: (version: string) => Map<string,string>|null,
 *   clear: () => void
 * }}
 *
 * @example
 * const cache = createTarballCache({ cacheDir, metaFile, dataFile });
 * cache.save('19.3.1', filesMap);
 * const files = cache.load('19.3.1');
 */
export function createTarballCache({ cacheDir, metaFile, dataFile }) {
  /**
   * Save versioned tarball cache to disk.
   * @param {string} version - Package version (e.g., "19.3.1").
   * @param {Map<string,string>} filesMap - Extracted file map.
   */
  function save(version, filesMap) {
    ensureDir(cacheDir);
    const filesObject = Object.fromEntries(filesMap);
    const checksum = computeChecksum(filesObject);

    saveJson(dataFile, filesObject);
    saveJson(metaFile, { version, checksum, timestamp: Date.now() });
    logger.info(`💾 Saved cache for v${version}`);
  }

  /**
   * Load cache if valid for the given version.
   * @param {string} version - Package version to validate.
   * @returns {Map<string,string>|null} Cached data, or null if invalid/missing.
   */
  function load(version) {
    if (!fs.existsSync(metaFile) || !fs.existsSync(dataFile)) return null;

    try {
      const meta = loadJson(metaFile);
      if (meta.version !== version) return null;

      const files = loadJson(dataFile);
      const map = new Map(Object.entries(files));

      if (map.size < 5) {
        logger.warn(`⚠️ Cache incomplete for v${version}, regenerating...`);
        clear();
        return null;
      }

      logger.info(`📦 Using cached v${version}`);
      return map;
    } catch (err) {
      logger.warn(`⚠️ Failed to load cache: ${err.message}`);
      return null;
    }
  }

  /**
   * Remove the entire cache directory recursively.
   */
  function clear() {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    logger.info(`🗑️ Cleared cache directory: ${cacheDir}`);
  }

  return { save, load, clear };
}
