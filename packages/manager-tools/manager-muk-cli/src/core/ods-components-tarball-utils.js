import https from 'node:https';

import {
  DISABLE_ODS_COMPONENTS_CACHE,
  EMOJIS,
  ODS_COMPONENTS_CACHE_DIR,
  ODS_COMPONENTS_LATEST_URL,
  ODS_COMPONENTS_META_CACHE_FILE,
  ODS_COMPONENTS_TAR_CACHE_FILE,
} from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';
import { toPascalCase } from './file-utils.js';
import { createTarballCache } from './tarball-cache-utils.js';
import { streamTarGz } from './tarball-utils.js';

/**
 * Fetch the latest metadata for the ODS Components NPM package.
 *
 * This function retrieves the `version` and `dist.tarball` URL from the NPM registry.
 * It is used by `extractOdsComponentsTarball()` to determine which version of the
 * tarball to download.
 *
 * @async
 * @returns {Promise<{ version: string, tarball: string }>} Package version and tarball URL.
 */
export async function getOdsComponentsPackageMetadata() {
  return new Promise((resolve, reject) => {
    https
      .get(ODS_COMPONENTS_LATEST_URL, (res) => {
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
 * Extracts and caches the contents of the latest ODS Components tarball.
 *
 * The tarball is downloaded from the NPM registry, decompressed, and parsed.
 * Extracted file contents are stored in a `Map` keyed by their relative paths.
 *
 * To avoid redundant network calls, the result is cached locally using
 * `createTarballCache()`. Cache can be disabled with the environment variable:
 * `ADD_COMPONENTS_NO_CACHE=1`
 *
 * @async
 * @param {RegExp} [pattern] - Optional RegExp to filter which paths to include.
 * @returns {Promise<Map<string, string>>} Map of file paths → file contents (UTF-8).
 */
export async function extractOdsComponentsTarball(pattern) {
  const { version, tarball } = await getOdsComponentsPackageMetadata();

  const cache = createTarballCache({
    cacheDir: ODS_COMPONENTS_CACHE_DIR,
    metaFile: ODS_COMPONENTS_META_CACHE_FILE,
    dataFile: ODS_COMPONENTS_TAR_CACHE_FILE,
  });

  // Try to load from cache unless disabled
  if (!DISABLE_ODS_COMPONENTS_CACHE) {
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
 * Component file path templates used to locate `.tsx` source files
 * across various ODS directory structures.
 *
 * Some components live under `src/components`, others under
 * `package/src/components`, and subcomponents often use PascalCase folders.
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
 * Expand a template string with provided path parameters.
 * @param {string} template - Path template with placeholders.
 * @param {object} context - Replacement values for placeholders.
 * @returns {string} Expanded file path.
 */
function expandTemplate(template, context) {
  return template
    .replace(/\$\{parent\}/g, context.parent)
    .replace(/\$\{target\}/g, context.target)
    .replace(/\$\{pascalParent\}/g, context.pascalParent)
    .replace(/\$\{pascalSub\}/g, context.pascalSub);
}

/**
 * Factory function that returns path builders for ODS component files.
 *
 * @param {string} parent - Parent component name (kebab-case).
 * @param {string} [subcomponent] - Optional subcomponent name.
 * @returns {{
 *   buildAll(): string[],
 *   build(filter?: string): string[],
 *   buildByKey(key: string): string[]
 * }}
 */
function createOdsComponentsPath(parent, subcomponent) {
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
 * Attempt to find and return a matching component source file from the tarball.
 *
 * @param {Map<string,string>} files - Map of tarball entries.
 * @param {string[]} possiblePaths - List of possible candidate paths.
 * @param {string} name - Component name (for logging).
 * @returns {string|null} File content as UTF-8 string, or null if not found.
 */
function findOdsComponentsSourceFile(files, possiblePaths, name) {
  const fileEntry = possiblePaths.map((p) => files.get(p)).find(Boolean);
  if (!fileEntry) {
    logger.warn(`⚠ Could not find source file for ${name}`);
    return null;
  }
  return fileEntry.toString('utf8');
}

/**
 * Simple heuristic-based detection for `children` support in React components.
 * Checks for patterns like:
 * - `PropsWithChildren`
 * - `children:` in prop definitions
 * - `props.children` usage
 * - JSX child placeholders
 *
 * @param {string} content - TypeScript source file content.
 * @returns {boolean} Whether the component likely accepts `children`.
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
 * Detect whether an ODS component (or subcomponent) supports React `children`.
 *
 * Downloads (or loads from cache) the ODS tarball, locates the relevant `.tsx` file,
 * and applies heuristic-based analysis.
 *
 * @async
 * @param {string} parent - Component name (kebab-case).
 * @param {string} [subcomponent] - Optional subcomponent.
 * @returns {Promise<boolean|null>} True if supports children, false otherwise, null if not found.
 */
export async function detectHasChildrenFromTarball(parent, subcomponent) {
  const files = await extractOdsComponentsTarball();
  const factory = createOdsComponentsPath(parent, subcomponent);
  const possiblePaths = factory.buildAll();
  const content = findOdsComponentsSourceFile(files, possiblePaths, subcomponent ?? parent);

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
 * Detect whether a subcomponent exports its own prop type (e.g., `type MySubProp`).
 *
 * Used to infer type granularity for documentation generation.
 *
 * @async
 * @param {string} parent - Parent component name.
 * @param {string} subcomponent - Subcomponent name.
 * @returns {Promise<boolean>} Whether a prop type is exported from its index.
 */
export async function detectHasTypeExportFromIndex(parent, subcomponent) {
  const files = await extractOdsComponentsTarball();
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
 * Extract categorized exports (hooks, constants, external types) from a component index file.
 *
 * @async
 * @param {string} parent - Component name.
 * @returns {Promise<{hooks: string[], constants: string[], externalTypes: string[]}>}
 */
export async function extractOdsComponentsExportsByCategory(parent) {
  const files = await extractOdsComponentsTarball(/src\/components\/.*\/src\/index\.ts$/);
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

    // Ignore re-exports from subcomponents
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
