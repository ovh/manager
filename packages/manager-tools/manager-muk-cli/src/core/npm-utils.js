import https from 'node:https';

import { EMOJIS, NPM_REGISTRY_BASE } from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';

/**
 * Fetch the latest version of a package from the npm registry.
 * @param {string} pkgName
 * @returns {Promise<string>} latest version
 */
export async function fetchLatestVersion(pkgName) {
  const url = `${NPM_REGISTRY_BASE}/${pkgName.replace('/', '%2F')}/latest`;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.version);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

/**
 * Compare local ODS versions in a package.json object with latest npm versions.
 * Returns a list of { name, local, latest }.
 *
 * @param {object} pkgJson
 * @param {string[]} targetPackages
 * @returns {Promise<Array<{name: string, local: string, latest: string}>>}
 */
export async function getOutdatedPackages(pkgJson, targetPackages) {
  const results = [];

  logger.info(`${EMOJIS.info} Checking ODS package versions...`);

  for (const name of targetPackages) {
    const localVersion =
      pkgJson.devDependencies?.[name] ||
      pkgJson.dependencies?.[name] ||
      pkgJson.peerDependencies?.[name];

    if (!localVersion) {
      logger.warn(`${EMOJIS.warn} ${name} not found in local package.json`);
      continue;
    }

    const cleanLocal = localVersion.replace(/[\^~]/g, '');
    const latest = await fetchLatestVersion(name);

    if (cleanLocal !== latest) {
      results.push({ name, local: cleanLocal, latest });
    } else {
      logger.success(`${name} is up to date (${latest})`);
    }
  }

  return results;
}
