import https from 'node:https';
import { createGunzip } from 'node:zlib';
import tar from 'tar-stream';

import { EMOJIS, ODS_REACT_LATEST_URL } from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';
import { toPascalCase } from './file-utils.js';

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
 * Detects if a given component (or subcomponent) supports children by inspecting its source.
 *
 * @param {string} parent - kebab-case parent name (e.g. 'tooltip')
 * @param {string} [subcomponent] - optional subcomponent name (e.g. 'tooltip-trigger')
 * @returns {Promise<boolean>}
 */
export async function detectHasChildrenFromTarball(parent, subcomponent) {
  const files = await extractOdsTarball();

  // Handle possible tarball path prefixes like "package/"
  const possiblePaths = subcomponent
    ? [
        `src/components/${parent}/src/components/${subcomponent}/${toPascalCase(subcomponent)}.tsx`,
        `package/src/components/${parent}/src/components/${subcomponent}/${toPascalCase(subcomponent)}.tsx`,
      ]
    : [
        `src/components/${parent}/src/components/${parent}/${toPascalCase(parent)}.tsx`,
        `package/src/components/${parent}/src/components/${parent}/${toPascalCase(parent)}.tsx`,
      ];

  const fileEntry = possiblePaths.map((p) => files.get(p)).find(Boolean);

  if (!fileEntry) {
    logger.warn(`⚠ Could not find source file for ${subcomponent ?? parent}`);
    return false;
  }

  const content = fileEntry.toString('utf8');

  // Refined heuristic detection patterns
  const patterns = [
    /\bPropsWithChildren\b/, // imported React helper
    /\bchildren\s*:\s*/, // prop destructuring pattern
    /\bchildren\b(?=.*<\/)/s, // children in JSX (non-greedy, cross-line)
    /<.*>\s*{.*children.*}\s*<\/.*>/s, // explicit children interpolation
    /props\.children/, // direct props access
  ];

  const hasChildren = patterns.some((re) => re.test(content));

  logger.info(
    `${hasChildren ? '👶' : '🚫'} ${subcomponent ?? parent} ${hasChildren ? 'supports' : 'has no'} children`,
  );

  return hasChildren;
}

/**
 * Detects whether a subcomponent has its own exported Prop type in the parent index.ts
 *
 * @param {string} parent - kebab-case parent component (e.g. 'tooltip')
 * @param {string} subcomponent - kebab-case subcomponent (e.g. 'tooltip-trigger')
 * @returns {Promise<boolean>}
 */
export async function detectHasTypeExportFromIndex(parent, subcomponent) {
  const files = await extractOdsTarball();

  const possiblePaths = [
    `src/components/${parent}/src/index.ts`,
    `package/src/components/${parent}/src/index.ts`,
  ];
  const fileEntry = possiblePaths.map((p) => files.get(p)).find(Boolean);
  if (!fileEntry) {
    logger.warn(`⚠ Could not find index.ts for ${parent}`);
    return false;
  }

  const content = fileEntry.toString('utf8');
  const subPascal = toPascalCase(subcomponent);
  const typeName = `${subPascal}Prop`; // e.g., TooltipTriggerProp

  // look for `type TooltipTriggerProp` or `export { ..., type TooltipTriggerProp }`
  const typeExportRegex = new RegExp(`\\btype\\s+${typeName}\\b|\\b${typeName}\\b`, 'g');

  const found = typeExportRegex.test(content);

  logger.info(
    `${found ? '🧩' : '🚫'} ${subcomponent} ${
      found ? 'exports' : 'does not export'
    } its own Prop type`,
  );

  return found;
}
