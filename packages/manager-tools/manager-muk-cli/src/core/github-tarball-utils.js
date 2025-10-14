import https from 'node:https';

import { logger } from '../utils/log-manager.js';
import { streamTarGz } from './tarball-cache-utils.js';

/**
 * Internal utility — fetch JSON data with redirect and error handling.
 * @param {string} url - The API URL to fetch.
 * @param {number} [redirects=5] - Remaining redirect limit.
 * @returns {Promise<any>} Parsed JSON response.
 */
async function fetchJson(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'manager-muk-cli',
            Accept: 'application/vnd.github+json',
          },
        },
        (res) => {
          const { statusCode, headers } = res;

          // Follow redirects
          if (statusCode >= 300 && statusCode < 400 && headers.location && redirects > 0) {
            res.resume();
            return resolve(fetchJson(headers.location, redirects - 1));
          }

          if (statusCode !== 200) {
            return reject(new Error(`Failed to fetch ${url} (status ${statusCode})`));
          }

          let data = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(new Error(`Invalid JSON from ${url}: ${err.message}`));
            }
          });
        },
      )
      .on('error', reject);
  });
}

/**
 * Fetch the latest release tag for a given GitHub repository.
 * @param {string} owner - GitHub organization or user.
 * @param {string} repo - Repository name.
 * @returns {Promise<string>} Latest tag name (e.g., "v19.3.1").
 */
export async function getLatestTag(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/tags?per_page=1`;
  const tags = await fetchJson(url);
  const tag = tags?.[0]?.name;
  if (!tag) throw new Error(`No tag found for ${owner}/${repo}`);
  logger.info(`🏷️ Latest tag for ${owner}/${repo}: ${tag}`);
  return tag;
}

/**
 * @typedef {object} ExtractDocsOptions
 * @property {(entryPath: string) => boolean} filter - Function to select which files to extract.
 * @property {(entryPath: string, content: Buffer) => Promise<void>} onFile - Async handler for extracted files.
 * @property {string} [tag] - Optional tag to use (defaults to latest).
 */

/**
 * Download and extract the OVH Design System documentation files from GitHub.
 *
 * Automatically fetches the latest version unless a tag is provided.
 * Streams files directly without writing temporary archives.
 *
 * @param {ExtractDocsOptions} options - Extraction configuration.
 * @returns {Promise<void>} Resolves when extraction is complete.
 *
 * @example
 * await extractDesignSystemDocs({
 *   filter: (p) => p.includes('/stories/components/'),
 *   onFile: async (p, buf) => fs.writeFileSync(`local/${p}`, buf),
 * });
 */
export async function extractDesignSystemDocs({ filter, onFile, tag }) {
  const owner = 'ovh';
  const repo = 'design-system';
  const version = tag || (await getLatestTag(owner, repo));
  const url = `https://github.com/${owner}/${repo}/archive/refs/tags/${version}.tar.gz`;

  logger.info(`📦 Downloading OVH Design System ${version} from GitHub`);
  try {
    await streamTarGz(url, filter, onFile);
    logger.success(`✅ Successfully extracted files from ${repo}@${version}`);
  } catch (err) {
    logger.error(`❌ Failed to extract ${repo}@${version}: ${err.message}`);
    throw err;
  }
}
