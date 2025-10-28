import https from 'node:https';
import semver from 'semver';

import { EMOJIS, NPM_REGISTRY_BASE } from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';

/**
 * Fetch the latest version of a package from the npm registry.
 * @param {string} pkgName - Package name (e.g., "@ovh-ux/ui-kit").
 * @returns {Promise<string>} Latest version string (e.g., "19.4.0").
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
 * Detects both outdated and ahead-of-latest versions.
 *
 * @param {object} pkgJson - Parsed package.json contents.
 * @param {string[]} targetPackages - List of packages to compare.
 * @returns {Promise<Array<{name: string, local: string, latest: string, status: 'outdated' | 'ahead' | 'equal'}>>}
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

    // Compare semantically
    if (semver.valid(cleanLocal) && semver.valid(latest)) {
      if (semver.gt(cleanLocal, latest)) {
        logger.info(
          `${EMOJIS.rocket} ${name} is ahead of npm (local ${cleanLocal} > latest ${latest})`,
        );
        results.push({ name, local: cleanLocal, latest, status: 'ahead' });
      } else if (semver.lt(cleanLocal, latest)) {
        logger.warn(`${EMOJIS.warn} ${name} is outdated (local ${cleanLocal} < latest ${latest})`);
        results.push({ name, local: cleanLocal, latest, status: 'outdated' });
      } else {
        logger.success(`${name} is up to date (${latest})`);
        results.push({ name, local: cleanLocal, latest, status: 'equal' });
      }
    } else {
      // Fallback for non-semver or prerelease versions
      const status = cleanLocal === latest ? 'equal' : 'unknown';
      results.push({ name, local: cleanLocal, latest, status });
      logger.info(`${EMOJIS.info} ${name} uses non-standard version (${cleanLocal})`);
    }
  }

  return results;
}
