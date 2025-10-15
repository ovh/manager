import { Buffer } from 'node:buffer';
import { Readable } from 'node:stream';

import {
  DISABLE_ODS_DOCS_CACHE,
  EMOJIS,
  ODS_DOCS_CACHE_DIR,
  ODS_DOCS_META_CACHE_FILE,
  ODS_DOCS_TAR_CACHE_FILE,
  ODS_GITHUB_REPO_BASE_URL,
  ODS_TAR_COMPONENTS_PATH,
} from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';
import { getOdsComponentsPackageMetadata } from './ods-components-tarball-utils.js';
import { createTarballCache } from './tarball-cache-utils.js';
import { streamTarGz } from './tarball-utils.js';

/**
 * Normalize cached data to an iterable [path, buffer] format.
 * @param {Map<string, Buffer>|Object} cached - Cached data structure.
 * @returns {[string, Buffer][]}
 */
function normalizeCacheEntries(cached) {
  if (cached instanceof Map) return [...cached.entries()];
  if (cached && typeof cached === 'object') return Object.entries(cached);
  return [];
}

/**
 * Safely load cached ODS documentation, handling both Map and plain objects.
 * @param {ReturnType<typeof createTarballCache>} cache
 * @param {string} version
 * @returns {[string, Buffer][]|null}
 */
function getOdsDocsCache(cache, version) {
  const cached = cache.load(version);
  if (!cached) return null;

  const entries = normalizeCacheEntries(cached);
  if (entries.length === 0) {
    logger.warn(`⚠️ Cache is valid but empty, skipping stream.`);
    return null;
  }

  logger.info(`${EMOJIS.check} Using cached ODS documentation (v${version})`);
  return entries;
}

/**
 * Stream documentation files from cache.
 * @param {[string, Buffer][]} entries
 * @param {(path: string) => boolean} filter
 * @param {(path: string, buffer: Buffer) => Promise<void>} onFile
 * @param {(path: string, stream: Readable) => Promise<void>|null} onFileStream
 */
async function streamCachedDocs(entries, filter, onFile, onFileStream) {
  for (const [entryPath, buffer] of entries) {
    if (!filter(entryPath)) continue;
    const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

    if (onFileStream) {
      const stream = Readable.from(buf);
      await onFileStream(entryPath, stream);
    } else {
      await onFile(entryPath, buf);
    }
  }

  logger.success(`${EMOJIS.disk} Served ${entries.length} documentation files from cache.`);
}

/**
 * Download ODS docs tarball, stream files, and save cache.
 * @param {string} url - Tarball URL.
 * @param {string} version - Version for cache.
 * @param {(path: string) => boolean} filter
 * @param {(path: string, buffer: Buffer) => Promise<void>} onFile
 * @param {(path: string, stream: Readable) => Promise<void>|null} onFileStream
 * @param {ReturnType<typeof createTarballCache>} cache
 */
async function downloadAndCacheDocs({ url, version, filter, onFile, onFileStream, cache }) {
  logger.info(`${EMOJIS.package} Fetching ODS Design System tarball from ${url}`);
  const files = new Map();

  await streamTarGz(url, filter, async (entryPath, content) => {
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
    files.set(entryPath, buffer);

    // Immediately stream to consumer while downloading
    if (onFileStream) {
      const stream = Readable.from(buffer);
      await onFileStream(entryPath, stream);
    } else {
      await onFile(entryPath, buffer);
    }
  });

  cache.save(version, files);
  logger.success(
    `${EMOJIS.check} Cached ODS Design System documentation (v${version}) for future runs.`,
  );
}

/**
 * High-level orchestrator for ODS Design System documentation extraction.
 * Uses cache when available, otherwise streams from tarball.
 *
 * @async
 * @param {Object} options
 * @param {(entryPath: string) => boolean} [options.filter=() => true]
 * @param {(entryPath: string, content: Buffer) => Promise<void>} [options.onFile=async()=>{}]
 * @param {(entryPath: string, stream: Readable) => Promise<void>} [options.onFileStream=null]
 * @param {string} [options.tag] - Optional explicit version tag
 */
export async function extractDesignSystemDocs({
  filter = () => true,
  onFile = async () => {},
  onFileStream = null,
  tag = null,
}) {
  const { version } = await getOdsComponentsPackageMetadata();
  const resolvedTag = tag ?? version;
  const url = `${ODS_GITHUB_REPO_BASE_URL}/v${resolvedTag}.tar.gz`;

  logger.info(`${EMOJIS.package} Preparing to extract ODS docs (v${resolvedTag})…`);

  const cache = createTarballCache({
    cacheDir: ODS_DOCS_CACHE_DIR,
    metaFile: ODS_DOCS_META_CACHE_FILE,
    dataFile: ODS_DOCS_TAR_CACHE_FILE,
  });

  if (!DISABLE_ODS_DOCS_CACHE) {
    const entries = getOdsDocsCache(cache, version);
    if (entries) {
      await streamCachedDocs(entries, filter, onFile, onFileStream);
      return;
    }
  }

  await downloadAndCacheDocs({
    url,
    version,
    filter,
    onFile,
    onFileStream,
    cache,
  });
}

/**
 * Extract component-level info from tarball entry path.
 * @param {string} tarPath
 * @returns {{component: string|null, relPath: string|null}}
 */
export function extractComponentDocumentationInfos(tarPath) {
  const idx = tarPath.indexOf(ODS_TAR_COMPONENTS_PATH);
  if (idx < 0) return { component: null, relPath: null };

  const relFromComponents = tarPath.slice(idx + ODS_TAR_COMPONENTS_PATH.length);
  const parts = relFromComponents.split('/').filter(Boolean);
  if (parts.length < 2) return { component: null, relPath: null };

  const [component, ...rest] = parts;
  const relPath = rest.join('/');
  if (!relPath || relPath.endsWith('/')) return { component: null, relPath: null };

  return { component, relPath };
}
