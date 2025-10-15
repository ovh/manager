import crypto from 'node:crypto';
import fs from 'node:fs';

import { logger } from '../utils/log-manager.js';
import { ensureDir, loadJson, saveJson } from './file-utils.js';

/**
 * Compute a SHA256 checksum for an object or string.
 * @param {object|string} obj - Data to hash.
 * @returns {string} SHA256 hex digest.
 */
export function computeChecksum(obj) {
  return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
}

/**
 * @typedef {object} TarballCacheConfig
 * @property {string} cacheDir - Directory to store cache files.
 * @property {string} metaFile - Path to metadata JSON file.
 * @property {string} dataFile - Path to cached data JSON file.
 * @property {number} [ttlMs=604800000] - Time-to-live in milliseconds (default: 7 days).
 */

/**
 * Create a functional tarball cache handler with TTL and checksum verification.
 *
 * Provides:
 * - `save(version, filesMap)` → persist cache
 * - `load(version)` → load cache if valid, unexpired, and consistent
 * - `clear()` → delete cache directory
 *
 * @param {TarballCacheConfig} config
 * @returns {{
 *   save: (version: string, filesMap: Map<string,string>) => void,
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
  const clear = () => {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    logger.info(`🗑️ Cleared cache directory: ${cacheDir}`);
  };

  const validateMeta = (meta, version) => {
    if (!meta || typeof meta !== 'object') return 'invalid metadata';
    if (meta.version !== version) return `version mismatch (${meta.version} ≠ ${version})`;
    return null;
  };

  const validateTTL = (timestamp) => {
    const age = Date.now() - timestamp;
    if (age > ttlMs) {
      const daysOld = (age / 86400000).toFixed(1);
      return { expired: true, message: `${daysOld} days old` };
    }
    return { expired: false, age };
  };

  const normalizeMap = (files) => {
    if (!files || typeof files !== 'object') return new Map();
    return new Map(Object.entries(files));
  };

  const verifyChecksum = (files, meta) => {
    const computed = computeChecksum(files);
    return computed === meta.checksum;
  };

  const save = (version, filesMap) => {
    try {
      ensureDir(cacheDir);

      const filesObject = Object.fromEntries(
        filesMap instanceof Map ? filesMap : new Map(Object.entries(filesMap || {})),
      );

      const checksum = computeChecksum(filesObject);
      const meta = { version, checksum, timestamp: Date.now() };

      saveJson(dataFile, filesObject);
      saveJson(metaFile, meta);

      logger.info(`💾 Saved cache for v${version} (TTL: ${(ttlMs / 86400000).toFixed(1)} days)`);
    } catch (err) {
      logger.error(`❌ Failed to save cache: ${err.message}`);
    }
  };

  const load = (version) => {
    if (!fs.existsSync(metaFile) || !fs.existsSync(dataFile)) return null;

    try {
      const meta = loadJson(metaFile);
      const invalidMetaReason = validateMeta(meta, version);
      if (invalidMetaReason) {
        logger.warn(`⚠️ Invalid cache meta: ${invalidMetaReason}`);
        clear();
        return null;
      }

      // TTL validation
      const ttl = validateTTL(meta.timestamp);
      if (ttl.expired) {
        logger.warn(`⚠️ Cache expired (${ttl.message}) — regenerating...`);
        clear();
        return null;
      }

      // Load and normalize files
      const files = loadJson(dataFile);
      if (!files || typeof files !== 'object') {
        logger.warn(`⚠️ Cache data file corrupted — regenerating...`);
        clear();
        return null;
      }

      // Checksum validation
      if (!verifyChecksum(files, meta)) {
        logger.warn(`⚠️ Cache checksum mismatch — regenerating...`);
        clear();
        return null;
      }

      const map = normalizeMap(files);

      if (map.size === 0) {
        logger.info(`ℹ️ Cache for v${version} is empty but valid (no files).`);
        return map;
      }

      const ageDays = (ttl.age / 86400000).toFixed(1);
      logger.info(
        `📦 Using cached v${version} (age: ${ageDays} days, fresh < ${(ttlMs / 86400000).toFixed(
          1,
        )} days)`,
      );

      return map;
    } catch (err) {
      logger.warn(`⚠️ Failed to load cache: ${err.message}`);
      clear();
      return null;
    }
  };

  return { save, load, clear };
}
