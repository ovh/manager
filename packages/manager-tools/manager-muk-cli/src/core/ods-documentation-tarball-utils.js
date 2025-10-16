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

  // 🧠 Validation: ensure cache includes storybook/src files
  const hasStorybookSrc = entries.some(([p]) => p.includes('packages/storybook/src/'));
  if (!hasStorybookSrc) {
    logger.warn(`${EMOJIS.warn} Cache missing Storybook sources — forcing re-download.`);
    return null;
  }

  logger.info(`${EMOJIS.check} Using cached ODS documentation (v${version})`);
  return entries;
}

/**
 * Stream documentation files from cache after applying filter.
 */
async function streamCachedDocs(entries, filter, onFile, onFileStream) {
  let streamed = 0;

  for (const [entryPath, buffer] of entries) {
    if (!filter(entryPath)) continue;

    const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    if (onFileStream) {
      const stream = Readable.from(buf);
      await onFileStream(entryPath, stream);
    } else {
      await onFile(entryPath, buf);
    }
    streamed++;
  }

  logger.success(`${EMOJIS.disk} Streamed ${streamed} documentation files from cache.`);
}

/**
 * Download ODS docs tarball, stream files, and save cache.
 * The filter is applied *after* caching, so the cache always contains the full tarball.
 */
async function downloadAndCacheDocs({ url, version, filter, onFile, onFileStream, cache }) {
  logger.info(`${EMOJIS.package} Fetching ODS Design System tarball from ${url}`);
  const files = new Map();

  await streamTarGz(
    url,
    () => true,
    async (entryPath, content) => {
      const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
      files.set(entryPath, buffer);

      // Apply filter only for streamed consumer events
      if (!filter(entryPath)) return;

      if (onFileStream) {
        const stream = Readable.from(buffer);
        await onFileStream(entryPath, stream);
      } else {
        await onFile(entryPath, buffer);
      }
    },
  );

  cache.save(version, files);
  logger.success(
    `${EMOJIS.check} Cached ODS Design System documentation (v${version}) for future runs.`,
  );
}

/**
 * High-level orchestrator for ODS Design System documentation extraction.
 * Uses cache when available, otherwise streams from tarball.
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
