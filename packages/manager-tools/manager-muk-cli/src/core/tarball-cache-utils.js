import crypto from 'node:crypto';
import fs from 'node:fs';

import { logger } from '../utils/log-manager.js';
import { ensureDir, loadJson, saveJson } from './file-utils.js';

/**
 * Validate cache metadata consistency with expected version.
 * @param {object} meta - Metadata object read from cache.
 * @param {string} version - Expected version string.
 * @returns {string|null} Error message if invalid, otherwise null.
 */
function validateMeta(meta, version) {
  if (!meta || typeof meta !== 'object') return 'invalid metadata';
  if (meta.version !== version) return `version mismatch (${meta.version} ≠ ${version})`;
  return null;
}

/**
 * Validate cache freshness based on timestamp and TTL.
 * @param {number} timestamp - Unix epoch of cache creation.
 * @param {number} ttlMs - Time-to-live in milliseconds.
 * @returns {{ expired: boolean, age?: number, message?: string }}
 *  `expired` is true if TTL exceeded, otherwise contains age in ms.
 */
function validateTTL(timestamp, ttlMs) {
  const age = Date.now() - timestamp;
  if (age > ttlMs) {
    const daysOld = (age / 86_400_000).toFixed(1);
    return { expired: true, message: `${daysOld} days old` };
  }
  return { expired: false, age };
}

/**
 * Compute SHA256 checksum for any serializable data.
 * @param {object|string} obj - Object or string to hash.
 * @returns {string} SHA256 hex digest.
 */
function computeChecksum(obj) {
  const data = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Verify that a file map matches the checksum stored in metadata.
 * @param {object|Map<string,string>} files - Cached file mapping.
 * @param {{ checksum: string }} meta - Metadata object containing checksum.
 * @returns {boolean} True if checksum matches.
 */
function verifyChecksum(files, meta) {
  const obj = files instanceof Map ? Object.fromEntries(files) : files;
  return computeChecksum(obj) === meta.checksum;
}

/**
 * @typedef {object} TarballCacheConfig
 * @property {string} cacheDir - Directory to store cache files.
 * @property {string} metaFile - Path to metadata JSON file.
 * @property {string} dataFile - Path to cached data JSON file.
 * @property {number} [ttlMs=604800000] - Time-to-live in milliseconds (default: 7 days).
 */

/**
 * Create a TTL-aware, checksum-validated tarball cache handler.
 *
 * Provides:
 * - `save(version, filesMap)` → persist cache
 * - `load(version)` → load cache if valid, unexpired, and consistent
 * - `clear()` → delete cache directory
 *
 * @param {TarballCacheConfig} config - Cache configuration.
 * @returns {{
 *   save: (version: string, filesMap: Map<string,string>|object) => void,
 *   load: (version: string) => Map<string,string>|null,
 *   clear: () => void
 * }}
 */
export function createTarballCache({
  cacheDir,
  metaFile,
  dataFile,
  ttlMs = 7 * 24 * 60 * 60 * 1000,
}) {
  /**
   * Remove all cache files from the cache directory.
   */
  const clear = () => {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    logger.info(`🗑️ Cleared cache directory: ${cacheDir}`);
  };

  /**
   * Persist current files and metadata to disk.
   * @param {string} version - Version identifier.
   * @param {Map<string,string>|object} filesMap - Files to cache.
   */
  const save = (version, filesMap) => {
    try {
      ensureDir(cacheDir);
      const files = filesMap instanceof Map ? Object.fromEntries(filesMap) : filesMap || {};
      const checksum = computeChecksum(files);
      const meta = { version, checksum, timestamp: Date.now() };

      saveJson(dataFile, files);
      saveJson(metaFile, meta);
      logger.info(`💾 Saved cache for v${version} (TTL: ${(ttlMs / 86_400_000).toFixed(1)} days)`);
    } catch (err) {
      logger.error(`❌ Failed to save cache: ${err.message}`);
    }
  };

  /**
   * Attempt to load a valid cache from disk.
   * @param {string} version - Version identifier.
   * @returns {Map<string,string>|null} Cached files map or null if invalid.
   */
  const load = (version) => {
    if (!fs.existsSync(metaFile) || !fs.existsSync(dataFile)) return null;

    try {
      const meta = loadJson(metaFile);
      const invalid = validateMeta(meta, version);
      if (invalid) return (logger.warn(`⚠️ Invalid cache meta: ${invalid}`), clear(), null);

      const ttl = validateTTL(meta.timestamp, ttlMs);
      if (ttl.expired) return (logger.warn(`⚠️ Cache expired (${ttl.message})`), clear(), null);

      const files = loadJson(dataFile);

      if (!files || typeof files !== 'object') {
        return (logger.warn(`⚠️ Corrupted cache data`), clear(), null);
      }

      if (!verifyChecksum(files, meta)) {
        return (logger.warn(`⚠️ Checksum mismatch`), clear(), null);
      }

      const map = new Map(Object.entries(files));
      logger.info(`📦 Using cached v${version} (age ${(ttl.age / 86_400_000).toFixed(1)} days)`);
      return map;
    } catch (err) {
      logger.warn(`⚠️ Failed to load cache: ${err.message}`);
      clear();
      return null;
    }
  };

  return { save, load, clear };
}
