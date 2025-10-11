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
 * Build all plausible source file paths for a given ODS component or subcomponent.
 */
function buildPossibleOdsPaths(parent, subcomponent) {
  const pascalParent = toPascalCase(parent);
  const pascalSub = subcomponent ? toPascalCase(subcomponent) : pascalParent;

  return subcomponent
    ? [
        // Legacy nested component structure
        `src/components/${parent}/src/components/${subcomponent}/${pascalSub}.tsx`,
        `package/src/components/${parent}/src/components/${subcomponent}/${pascalSub}.tsx`,

        // Flat (modern)
        `src/components/${parent}/src/${pascalSub}.tsx`,
        `package/src/components/${parent}/src/${pascalSub}.tsx`,

        // PascalCase subfolder (rare)
        `src/components/${parent}/src/components/${pascalSub}/${pascalSub}.tsx`,
        `package/src/components/${parent}/src/components/${pascalSub}/${pascalSub}.tsx`,
      ]
    : [
        // Modern ODS (range, combobox, etc.)
        `src/components/${parent}/src/${pascalParent}.tsx`,
        `package/src/components/${parent}/src/${pascalParent}.tsx`,

        // Legacy nested
        `src/components/${parent}/src/components/${parent}/${pascalParent}.tsx`,
        `package/src/components/${parent}/src/components/${parent}/${pascalParent}.tsx`,

        // 🔥 ODS 19.x direct component (like Range)
        `src/components/${parent}/${pascalParent}.tsx`,
        `package/src/components/${parent}/${pascalParent}.tsx`,
      ];
}

/**
 * Find and return the source file content for a given component path list.
 */
function findOdsSourceFile(files, possiblePaths, name) {
  const fileEntry = possiblePaths.map((p) => files.get(p)).find(Boolean);
  if (!fileEntry) {
    logger.warn(`⚠ Could not find source file for ${name}`);
    return null;
  }
  return fileEntry.toString('utf8');
}

/**
 * Detect whether a component file supports children based on its source code content.
 */
function detectChildrenHeuristics(content) {
  return [
    /\bPropsWithChildren\b/,
    /\bchildren\s*:\s*/,
    /props\.children/,
    /<.*>\s*{.*children.*}\s*<\/.*>/s,
  ].some((re) => re.test(content));
}

/**
 * Main entry — Detect if an ODS component exists and whether it supports children.
 *
 * @returns {Promise<boolean|null>} true = supports children, false = stateless, null = invalid
 */
export async function detectHasChildrenFromTarball(parent, subcomponent) {
  const files = await extractOdsTarball();
  const possiblePaths = buildPossibleOdsPaths(parent, subcomponent);
  const content = findOdsSourceFile(files, possiblePaths, subcomponent ?? parent);

  if (!content) return null; // ❌ not found

  const hasChildren = detectChildrenHeuristics(content);

  logger.info(
    `${hasChildren ? '👶' : '🚫'} ${subcomponent ?? parent} ${
      hasChildren ? 'supports' : 'has no'
    } children`,
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
  const typeName = `${subPascal}Prop`;

  const typeExportRegex = new RegExp(`\\btype\\s+${typeName}\\b|\\b${typeName}\\b`, 'g');
  const found = typeExportRegex.test(content);

  logger.info(
    `${found ? '🧩' : '🚫'} ${subcomponent} ${found ? 'exports' : 'does not export'} its own Prop type`,
  );
  return found;
}

/**
 * Categorize ODS index exports into:
 * - subcomponents (handled elsewhere)
 * - hooks (identifiers starting with "use")
 * - constants (from constants paths, excluding types)
 * - externalTypes (types from any non-components path)
 *
 * @param {string} parent - kebab-case ODS component name (e.g. 'datepicker')
 * @returns {Promise<{ hooks: string[], constants: string[], externalTypes: string[] }>}
 */
export async function extractOdsExportsByCategory(parent) {
  const files = await extractOdsTarball(/src\/components\/.*\/src\/index\.ts$/);
  const entry = [...files.entries()].find(([p]) =>
    p.endsWith(`src/components/${parent}/src/index.ts`),
  );

  if (!entry) {
    logger.warn(`⚠ No index.ts found for component '${parent}'`);
    return { hooks: [], constants: [], externalTypes: [] };
  }

  const content = entry[1];
  const exports = [...content.matchAll(/export\s+\{([\s\S]*?)\}\s+from\s+['"](.*?)['"]/g)];

  const hooks = new Set();
  const constants = new Set();
  const externalTypes = new Set();

  for (const [, block, fromPath] of exports) {
    const identifiers = block
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    // 🧩 1. Components — handled elsewhere
    if (fromPath.includes('components')) continue;

    // 🎣 2. Hooks — detect "use" in identifiers across all paths
    const hookNames = identifiers
      .map((id) => id.replace(/^type\s+/, ''))
      .filter((id) => /^use[A-Z]/.test(id));
    hookNames.forEach((h) => hooks.add(h));

    // ⚙️ 3. Constants — from constants path, all non-type exports
    if (fromPath.includes('constants')) {
      identifiers
        .filter((id) => !/^type\s+/i.test(id) && !/^interface\s+/i.test(id))
        .forEach((c) => constants.add(c.replace(/^type\s+/, '')));
      continue;
    }

    // 🧠 4. External Types — all "type" or "interface" from non-components paths
    identifiers
      .filter((id) => /^type\s+/i.test(id) || /^interface\s+/i.test(id))
      .map((id) => id.replace(/^(type|interface)\s+/, ''))
      .forEach((t) => externalTypes.add(t));
  }

  return {
    hooks: [...hooks].sort(),
    constants: [...constants].sort(),
    externalTypes: [...externalTypes].sort(),
  };
}
