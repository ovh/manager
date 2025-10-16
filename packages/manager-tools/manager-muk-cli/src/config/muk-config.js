import path from 'node:path';

/**
 * Enable / Disable caching components
 * @type {boolean}
 */
export const DISABLE_ODS_COMPONENTS_CACHE = false;

/**
 * Absolute directory path for caching extracted ODS tarball files and metadata.
 * Used to persist tarball contents between CLI runs.
 *
 * @constant {string}
 */
export const ODS_COMPONENTS_CACHE_DIR = path.resolve(
  'packages/manager-tools/manager-muk-cli/target/.cache/ods-tarball',
);

/**
 * Absolute path to the cached JSON file representing extracted tarball contents.
 * This file stores the list of ODS files and their relative paths.
 *
 * @constant {string}
 */
export const ODS_COMPONENTS_TAR_CACHE_FILE = path.join(
  ODS_COMPONENTS_CACHE_DIR,
  'ods-tarball-files.json',
);

/**
 * Absolute path to the metadata JSON file for the cached ODS tarball.
 * Metadata includes version number, checksum, and timestamp.
 *
 * @constant {string}
 */
export const ODS_COMPONENTS_META_CACHE_FILE = path.join(
  ODS_COMPONENTS_CACHE_DIR,
  'ods-tarball-meta.json',
);

/**
 * Cache settings for ODS documentation tarball
 */
export const ODS_DOCS_CACHE_DIR = path.resolve(
  'packages/manager-tools/manager-muk-cli/target/.cache/ods-docs',
);

/**
 * Path to the cached ODS documentation file map.
 *
 * Stores serialized tarball extraction results as `{ [entryPath]: Buffer }`.
 * Used to avoid re-downloading or re-extracting ODS tarballs when fresh.
 *
 * @constant
 * @type {string}
 * @example
 * "/packages/manager-tools/manager-muk-cli/target/.cache/ods-docs/ods-docs-files.json"
 */
export const ODS_DOCS_TAR_CACHE_FILE = path.join(ODS_DOCS_CACHE_DIR, 'ods-docs-files.json');

/**
 * Path to the ODS documentation cache metadata file.
 *
 * Contains metadata describing the cache state:
 * ```
 * {
 *   "version": "19.2.1",
 *   "checksum": "abc123...",
 *   "timestamp": 1728201000000
 * }
 * ```
 *
 * Used by `tarball-cache-utils.js` to validate cache freshness and version.
 *
 * @constant
 * @type {string}
 * @example
 * "/packages/manager-tools/manager-muk-cli/target/.cache/ods-docs/ods-docs-meta.json"
 */
export const ODS_DOCS_META_CACHE_FILE = path.join(ODS_DOCS_CACHE_DIR, 'ods-docs-meta.json');

/**
 * Global flag controlling whether ODS documentation caching is disabled.
 *
 * When `true`, the system skips all cache reads/writes and always downloads
 * the latest ODS tarball. Useful for debugging or CI environments.
 *
 * @constant
 * @type {boolean}
 * @default false
 * @example
 * // Force re-fetch documentation on each run
 * export const DISABLE_ODS_DOCS_CACHE = true;
 */
export const DISABLE_ODS_DOCS_CACHE = false;

/**
 * Absolute path to the Manager UI Kit (MUK) base package.
 *
 * @constant {string}
 */
export const MUK_COMPONENTS_PATH = path.resolve('packages/manager-ui-kit');

/**
 * Absolute path to the source components directory within the Manager UI Kit.
 *
 * @constant {string}
 */
export const MUK_COMPONENTS_SRC = path.join(MUK_COMPONENTS_PATH, 'src', 'components');

/**
 * Absolute path to the Manager Wiki base package.
 *
 * @constant {string}
 */
export const MUK_WIKI_PATH = path.resolve('packages/manager-wiki');

/**
 * Absolute path to the Manager Wiki components directory.
 * This is where base component documentation (e.g. `base-component-doc`) is stored.
 *
 * @constant {string}
 */
export const MUK_WIKI_COMPONENTS = path.join(
  MUK_WIKI_PATH,
  'stories',
  'manager-ui-kit',
  'components',
);

/**
 * Absolute path to the Manager Wiki components directory.
 * This is where base component documentation (e.g. `base-component-doc`) is stored.
 *
 * @constant {string}
 */
export const MUK_WIKI_BASED_DOCUMENT = path.join(
  MUK_WIKI_PATH,
  'stories',
  'manager-ui-kit',
  'base-documents',
);

/**
 * Subpath inside the ODS tarball where Storybook sources live.
 * We will mirror {components,constants,helpers} from here.
 *
 * Example tar paths:
 *   design-system-<tag>/packages/storybook/src/components/...
 *   design-system-<tag>/packages/storybook/src/constants/...
 *   design-system-<tag>/packages/storybook/src/helpers/...
 */
export const ODS_STORYBOOK_SRC_SUBPATH = 'packages/storybook/src';

/**
 * NPM package names that are validated and potentially updated
 * during version synchronization and documentation refresh.
 *
 * @constant {string[]}
 */
export const TARGET_PACKAGES = [
  '@ovhcloud/ods-components',
  '@ovhcloud/ods-react',
  '@ovhcloud/ods-themes',
];

/**
 * ODS React Package Name
 * @type {string}
 */
export const ODS_REACT_PACKAGE_NAME = '@ovhcloud/ods-react';

/**
 * Base URL for NPM registry metadata queries.
 *
 * @constant {string}
 */
export const NPM_REGISTRY_BASE = 'https://registry.npmjs.org';

/**
 * Endpoint for retrieving the latest metadata of the ODS React package.
 * Includes version, tarball URL, and dependency list.
 *
 * @constant {string}
 */
export const ODS_COMPONENTS_LATEST_URL = `${NPM_REGISTRY_BASE}/@ovhcloud%2Fods-react/latest`;

/**
 * Subpath (within the GitHub tarball) that contains the ODS component stories.
 * Used to filter relevant entries during extraction.
 *
 * @constant {string}
 */
export const ODS_TAR_COMPONENTS_PATH = '/packages/storybook/stories/components/';

/**
 * Absolute path (within the ODS tarball) to Storybook base source files.
 * These include components, constants, and helpers inside `packages/storybook/src`.
 *
 * @constant {string}
 */
export const ODS_TAR_STORYBOOK_PATH = 'packages/storybook/src/';

/**
 * GitHub repository slug (organization/name) where the ODS tarball is hosted.
 *
 * @constant {string}
 */
export const ODS_GITHUB_REPO_NAME = 'ovh/design-system';

/**
 * ODS Repository Base Url where the ODS tarball is hosted.
 *
 * @constant {string}
 */
export const ODS_GITHUB_REPO_BASE_URL = `https://github.com/${ODS_GITHUB_REPO_NAME}/archive/refs/tags`;

/**
 * Emoji constants used for consistent CLI log formatting.
 * These provide visual cues in console output.
 *
 * @typedef {Object} Emojis
 * @property {string} info     - Informational messages.
 * @property {string} check    - Validation success.
 * @property {string} folder   - Directory operations.
 * @property {string} package  - Package operations.
 * @property {string} warn     - Warnings or recoverable issues.
 * @property {string} error    - Fatal or critical errors.
 * @property {string} success  - Successful completion.
 * @property {string} disk     - File system operations.
 * @property {string} rocket   - Final success or completion.
 *
 * @constant {Emojis}
 */
export const EMOJIS = {
  info: 'ℹ️',
  check: '✅',
  folder: '📁',
  package: '📦',
  warn: '⚠️',
  error: '❌',
  success: '🎉',
  disk: '💾',
  rocket: '🚀',
};

/**
 * List of ODS component names excluded from synchronization.
 * These components are either deprecated, handled manually,
 * or incompatible with automated documentation sync.
 *
 * @constant {string[]}
 */
export const ODS_EXCLUDED_COMPONENTS = ['pagination'];
