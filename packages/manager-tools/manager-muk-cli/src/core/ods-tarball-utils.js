import https from 'node:https';
import { createGunzip } from 'node:zlib';
import tar from 'tar-stream';

import { EMOJIS, ODS_REACT_LATEST_URL } from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';

/**
 * Fetch JSON metadata for the latest ODS React package.
 * @returns {Promise<{ version: string, tarball: string }>}
 */
export async function getOdsPackageMetadata() {
  return new Promise((resolve, reject) => {
    https
      .get(ODS_REACT_LATEST_URL, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({ version: json.version, tarball: json.dist.tarball });
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

/**
 * Download and extract the ODS React tarball.
 * @param {RegExp} [pattern] - Optional regex to match entries (e.g., /\.d\.ts$/)
 * @returns {Promise<Map<string, string>>} Map of file paths → contents
 */
export async function extractOdsTarball(pattern) {
  const { version, tarball } = await getOdsPackageMetadata();
  logger.info(`${EMOJIS.package} Fetching ODS React v${version} tarball: ${tarball}`);

  const extract = tar.extract();
  const gunzip = createGunzip();
  const files = new Map();

  return new Promise((resolve, reject) => {
    extract.on('entry', (header, stream, next) => {
      const shouldExtract = !pattern || pattern.test(header.name);
      if (shouldExtract) {
        let content = '';
        stream.on('data', (chunk) => (content += chunk.toString()));
        stream.on('end', () => {
          files.set(header.name, content);
          next();
        });
      } else {
        stream.resume();
        stream.on('end', next);
      }
    });

    extract.on('finish', () => resolve(files));
    extract.on('error', reject);
    gunzip.on('error', reject);

    https
      .get(tarball, (res) => {
        res.on('error', reject);
        res.pipe(gunzip).pipe(extract);
      })
      .on('error', reject);
  });
}

/**
 * Detects whether a given ODS React component uses "children"
 * by inspecting only its main .tsx file from the npm tarball.
 *
 * This version terminates cleanly (no hanging).
 *
 * @param {string} component - kebab-case ODS component name (e.g. "accordion")
 * @returns {Promise<boolean>} true if the component uses "children"
 */
export async function detectHasChildrenFromTarball(component) {
  const { version, tarball } = await getOdsPackageMetadata();
  logger.info(`${EMOJIS.package} Fetching ODS React v${version} tarball to inspect "${component}"`);

  const extract = tar.extract();
  const gunzip = createGunzip();

  const targetFile = `src/components/${component}/src/components/${component}/${component
    .charAt(0)
    .toUpperCase()}${component.slice(1)}.tsx`;

  return new Promise((resolve, reject) => {
    let hasChildren = false;
    let finished = false;
    let req;

    const cleanup = () => {
      if (finished) return;
      finished = true;

      try {
        extract.destroy();
        gunzip.destroy();
        if (req && req.abort) req.abort();
      } catch (error) {
        logger.debug(`An error occurred. ${error.message}`);
      }

      resolve(hasChildren);
    };

    extract.on('entry', (header, stream, next) => {
      if (header.name.endsWith(targetFile)) {
        let content = '';
        stream.on('data', (chunk) => (content += chunk.toString()));
        stream.on('end', () => {
          hasChildren =
            content.includes('children') ||
            content.includes('{children}') ||
            content.includes('PropsWithChildren<');
          logger.debug(
            hasChildren ? `✅ ${component} uses children` : `🚫 ${component} does not use children`,
          );
          cleanup();
        });
      } else {
        stream.resume();
        stream.on('end', next);
      }
    });

    extract.on('finish', () => cleanup());
    extract.on('error', reject);
    gunzip.on('error', reject);

    req = https.get(tarball, (res) => res.pipe(gunzip).pipe(extract));
    req.on('error', reject);
  });
}
