import https from 'node:https';
import process from 'node:process';

import {
  CACHE_DIR,
  EMOJIS,
  META_CACHE_FILE,
  ODS_REACT_LATEST_URL,
  TAR_CACHE_FILE,
} from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';
import { toPascalCase } from './file-utils.js';
import { createTarballCache, streamTarGz } from './tarball-cache-utils.js';

/**
 * Fetch metadata for the latest ODS React package from npm.
 * @returns {Promise<{ version: string, tarball: string }>} Latest version and tarball URL.
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
 * Download, extract, and cache the ODS React tarball.
 * If a valid cache exists, it is used instead of re-downloading.
 *
 * @param {RegExp} [pattern] - Optional regex filter to extract only matching entries.
 * @returns {Promise<Map<string, string>>} Map of file paths → contents.
 */
export async function extractOdsTarball(pattern) {
  const { version, tarball } = await getOdsPackageMetadata();

  // Use functional cache version
  const cache = createTarballCache({
    cacheDir: CACHE_DIR,
    metaFile: META_CACHE_FILE,
    dataFile: TAR_CACHE_FILE,
  });

  const disableCache = !!process.env.ADD_COMPONENTS_NO_CACHE;

  // Load from cache if available and not disabled
  if (!disableCache) {
    const cached = cache.load(version);
    if (cached) {
      if (pattern) {
        return new Map([...cached.entries()].filter(([name]) => pattern.test(name)));
      }
      return cached;
    }
  }

  logger.info(`${EMOJIS.package} Fetching ODS React v${version} tarball: ${tarball}`);

  const files = new Map();

  await streamTarGz(
    tarball,
    (entryPath) => !pattern || pattern.test(entryPath),
    async (entryPath, content) => {
      files.set(entryPath, content.toString());
    },
  );

  cache.save(version, files);
  return files;
}

/**
 * @typedef {Object} OdsPathContext
 * @property {string} parent - Kebab-case parent component name.
 * @property {string} target - Subcomponent or parent name.
 * @property {string} pascalParent - PascalCase parent name.
 * @property {string} pascalSub - PascalCase subcomponent name.
 */

/**
 * Centralized declarative pattern definitions for ODS component paths.
 */
const ODS_PATH_PATTERNS = {
  withSub: {
    legacyNested: 'components/${parent}/src/components/${target}/${pascalSub}.tsx',
    flatModern: 'components/${parent}/src/${pascalSub}.tsx',
    pascalFolder: 'components/${parent}/src/components/${pascalSub}/${pascalSub}.tsx',
  },
  withoutSub: {
    modern: 'components/${parent}/src/${pascalParent}.tsx',
    legacyNested: 'components/${parent}/src/components/${parent}/${pascalParent}.tsx',
    direct: 'components/${parent}/${pascalParent}.tsx',
  },
};

/**
 * Expand a path template using contextual replacements.
 * @param {string} template - Template string with placeholders.
 * @param {OdsPathContext} context - Replacement context.
 * @returns {string} Expanded path string.
 */
function expandTemplate(template, context) {
  return template
    .replace(/\$\{parent\}/g, context.parent)
    .replace(/\$\{target\}/g, context.target)
    .replace(/\$\{pascalParent\}/g, context.pascalParent)
    .replace(/\$\{pascalSub\}/g, context.pascalSub);
}

/**
 * Factory that builds possible ODS source file paths for a given component.
 * @param {string} parent - Parent component name (kebab-case).
 * @param {string} [subcomponent] - Optional subcomponent name (kebab-case).
 * @returns {{
 *   buildAll: () => string[],
 *   build: (filter?: string) => string[],
 *   buildByKey: (key: string) => string[]
 * }}
 */
function createOdsPath(parent, subcomponent) {
  const pascalParent = toPascalCase(parent);
  const pascalSub = subcomponent ? toPascalCase(subcomponent) : pascalParent;
  const target = subcomponent ?? parent;
  const roots = ['src', 'package/src'];
  const patternGroup = subcomponent ? ODS_PATH_PATTERNS.withSub : ODS_PATH_PATTERNS.withoutSub;

  const buildSet = (patterns) =>
    roots.flatMap((root) =>
      patterns.map(
        (tpl) => `${root}/${expandTemplate(tpl, { parent, target, pascalParent, pascalSub })}`,
      ),
    );

  return {
    buildAll() {
      return buildSet(Object.values(patternGroup));
    },
    build(filter) {
      const filtered = Object.entries(patternGroup)
        .filter(([key]) => !filter || key.includes(filter))
        .map(([, tpl]) => tpl);
      return buildSet(filtered);
    },
    buildByKey(key) {
      const tpl = patternGroup[key];
      return tpl ? buildSet([tpl]) : [];
    },
  };
}

/**
 * Find and return the source file content for a given component path list.
 * @param {Map<string,string>} files - Tarball-extracted file map.
 * @param {string[]} possiblePaths - Candidate relative paths.
 * @param {string} name - Component name for logging.
 * @returns {string|null} UTF-8 content or null.
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
 * Heuristic detection of `children` support in ODS component source.
 * @param {string} content - Component source code.
 * @returns {boolean} True if children detected.
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
 * Detect if an ODS component supports children based on source analysis.
 * @param {string} parent - Kebab-case parent name.
 * @param {string} [subcomponent] - Optional subcomponent.
 * @returns {Promise<boolean|null>} true = supports children, false = stateless, null = not found.
 */
export async function detectHasChildrenFromTarball(parent, subcomponent) {
  const files = await extractOdsTarball();
  const factory = createOdsPath(parent, subcomponent);
  const possiblePaths = factory.buildAll();
  const content = findOdsSourceFile(files, possiblePaths, subcomponent ?? parent);

  if (!content) return null;
  const hasChildren = detectChildrenHeuristics(content);

  logger.info(
    `${hasChildren ? '👶' : '🚫'} ${subcomponent ?? parent} ${
      hasChildren ? 'supports' : 'has no'
    } children`,
  );

  return hasChildren;
}

/**
 * Detect whether a subcomponent has its own exported Prop type in the parent index.ts.
 * @param {string} parent - Parent component (e.g., "tooltip").
 * @param {string} subcomponent - Subcomponent (e.g., "tooltip-trigger").
 * @returns {Promise<boolean>} True if type export exists.
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
    `${found ? '🧩' : '🚫'} ${subcomponent} ${
      found ? 'exports' : 'does not export'
    } its own Prop type`,
  );
  return found;
}

/**
 * Extract hooks, constants, and external types from an ODS component index.ts.
 * @param {string} parent - ODS component name (e.g., "datepicker").
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

    if (fromPath.includes('components')) continue;

    identifiers
      .map((id) => id.replace(/^type\s+/, ''))
      .filter((id) => /^use[A-Z]/.test(id))
      .forEach((h) => hooks.add(h));

    if (fromPath.includes('constants')) {
      identifiers
        .filter((id) => !/^type\s+/i.test(id) && !/^interface\s+/i.test(id))
        .forEach((c) => constants.add(c.replace(/^type\s+/, '')));
      continue;
    }

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
