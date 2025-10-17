import crypto from 'node:crypto';
import fs from 'node:fs';
import https from 'node:https';
import process from 'node:process';
import { createGunzip } from 'node:zlib';
import tar from 'tar-stream';

import {
  CACHE_DIR,
  EMOJIS,
  META_CACHE_FILE,
  ODS_REACT_LATEST_URL,
  TAR_CACHE_FILE,
} from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';
import { toPascalCase } from './file-utils.js';

/**
 * Ensure that the ODS tarball cache directory exists.
 * Creates `target/.cache/ods-tarball` recursively if missing.
 * @returns {void}
 */
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Save the extracted tarball contents and metadata to disk.
 *
 * @param {string} version - ODS React package version (e.g., "19.3.1").
 * @param {Map<string, string>} filesMap - Map of extracted file paths → contents.
 * @returns {void}
 */
function saveCache(version, filesMap) {
  ensureCacheDir();
  const filesObject = Object.fromEntries(filesMap);
  const checksum = crypto.createHash('sha256').update(JSON.stringify(filesObject)).digest('hex');

  fs.writeFileSync(TAR_CACHE_FILE, JSON.stringify(filesObject, null, 2));
  fs.writeFileSync(
    META_CACHE_FILE,
    JSON.stringify({ version, checksum, timestamp: Date.now() }, null, 2),
  );

  logger.info(`${EMOJIS.disk} Saved ODS tarball cache (v${version})`);
}

/**
 * Attempt to load the cached tarball files if version matches and cache is valid.
 *
 * @param {string} version - Current ODS React package version.
 * @returns {Map<string, string>|null} Cached file map or null if cache invalid/missing.
 */
function loadCache(version) {
  if (!fs.existsSync(TAR_CACHE_FILE) || !fs.existsSync(META_CACHE_FILE)) return null;
  try {
    const meta = JSON.parse(fs.readFileSync(META_CACHE_FILE, 'utf8'));
    if (meta.version !== version) return null;

    const files = JSON.parse(fs.readFileSync(TAR_CACHE_FILE, 'utf8'));
    const map = new Map(Object.entries(files));

    if (map.size < 50) {
      logger.warn('⚠️ Cache appears incomplete — regenerating tarball extraction.');
      fs.rmSync(CACHE_DIR, { recursive: true, force: true });
      return null;
    }

    logger.info(`${EMOJIS.package} Using cached ODS React v${version} tarball`);
    return map;
  } catch (err) {
    logger.warn(`⚠️ Failed to load ODS cache (${err.message})`);
    return null;
  }
}

/**
 * Fetch JSON metadata for the latest ODS React package.
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
 * Download, extract, and (optionally) cache the ODS React tarball.
 * If a valid cache exists for the current version, it will be used instead.
 *
 * @param {RegExp} [pattern] - Optional regex to match entries (e.g., /\.d\.ts$/).
 * @returns {Promise<Map<string, string>>} Map of file paths → file contents.
 */
export async function extractOdsTarball(pattern) {
  const { version, tarball } = await getOdsPackageMetadata();
  ensureCacheDir();

  const disableCache = !!process.env.ADD_COMPONENTS_NO_CACHE;

  // Try loading from cache unless explicitly disabled
  if (!disableCache) {
    const cachedFiles = loadCache(version);
    if (cachedFiles) {
      if (pattern) {
        return new Map([...cachedFiles.entries()].filter(([name]) => pattern.test(name)));
      }
      return cachedFiles;
    }
  }

  // Fallback — live extraction from tarball
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

    extract.on('finish', () => {
      saveCache(version, files);
      resolve(files);
    });

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
 * @typedef {Object} OdsPathContext
 * @property {string} parent - Kebab-case parent component name.
 * @property {string} target - Subcomponent or parent name.
 * @property {string} pascalParent - PascalCase parent name.
 * @property {string} pascalSub - PascalCase subcomponent name.
 */

/**
 * Centralized declarative pattern definitions for ODS component paths.
 * Each key describes a semantic category (legacyNested, flatModern, etc.).
 */
const ODS_PATH_PATTERNS = {
  withSub: {
    /** Legacy nested component structure */
    legacyNested: 'components/${parent}/src/components/${target}/${pascalSub}.tsx',
    /** Modern flat structure */
    flatModern: 'components/${parent}/src/${pascalSub}.tsx',
    /** PascalCase subfolder structure (rare) */
    pascalFolder: 'components/${parent}/src/components/${pascalSub}/${pascalSub}.tsx',
  },
  withoutSub: {
    /** Modern ODS (typical) */
    modern: 'components/${parent}/src/${pascalParent}.tsx',
    /** Legacy nested variant */
    legacyNested: 'components/${parent}/src/components/${parent}/${pascalParent}.tsx',
    /** Direct ODS 19.x component form */
    direct: 'components/${parent}/${pascalParent}.tsx',
  },
};

/**
 * Expands a template string using contextual replacements.
 * @param {string} template - Path template containing placeholders.
 * @param {OdsPathContext} context - Replacement values.
 * @returns {string} The expanded path string.
 */
function expandTemplate(template, context) {
  return template
    .replace(/\$\{parent\}/g, context.parent)
    .replace(/\$\{target\}/g, context.target)
    .replace(/\$\{pascalParent\}/g, context.pascalParent)
    .replace(/\$\{pascalSub\}/g, context.pascalSub);
}

/**
 * Factory that builds all possible ODS component path variants.
 *
 * @param {string} parent - Parent component name (e.g., "button").
 * @param {string} [subcomponent] - Optional subcomponent name (e.g., "icon").
 * @returns {{
 *   buildAll: () => string[],
 *   build: (filter?: string) => string[],
 *   buildByKey: (key: string) => string[]
 * }}
 *
 * @example
 * const factory = createOdsPath('button', 'icon');
 * factory.buildAll();        // → all path variants
 * factory.build('legacy');   // → only legacy variants
 * factory.buildByKey('flatModern'); // → specific pattern variant
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
 *
 * @param {Map<string,string>} files - Tarball-extracted file map.
 * @param {string[]} possiblePaths - Candidate relative paths.
 * @param {string} name - Component or subcomponent name (for logging).
 * @returns {string|null} UTF-8 file contents or null if not found.
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
 * @param {string} content - Source file content.
 * @returns {boolean} True if children detected, false otherwise.
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
 * @param {string} parent - Kebab-case parent component (e.g., 'button').
 * @param {string} [subcomponent] - Optional subcomponent (e.g., 'icon').
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
 * Detects whether a subcomponent has its own exported Prop type in the parent index.ts.
 *
 * @param {string} parent - Kebab-case parent component (e.g., 'tooltip').
 * @param {string} subcomponent - Kebab-case subcomponent (e.g., 'tooltip-trigger').
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
 * Categorize ODS index exports into:
 *  - hooks (identifiers starting with "use")
 *  - constants (from constants paths, excluding types)
 *  - externalTypes (types from non-component paths)
 *
 * @param {string} parent - Kebab-case ODS component name (e.g. 'datepicker').
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

    // Hooks
    identifiers
      .map((id) => id.replace(/^type\s+/, ''))
      .filter((id) => /^use[A-Z]/.test(id))
      .forEach((h) => hooks.add(h));

    // Constants
    if (fromPath.includes('constants')) {
      identifiers
        .filter((id) => !/^type\s+/i.test(id) && !/^interface\s+/i.test(id))
        .forEach((c) => constants.add(c.replace(/^type\s+/, '')));
      continue;
    }

    // External Types
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
