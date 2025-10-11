/**
 * CLI configuration constants for manager-muk-cli.
 *
 * Keeping all shared constants and paths in one place ensures that the
 * different commands (checkVersions, checkComponents, update) remain aligned.
 */
import path from 'node:path';

/**
 * Directory for caching extracted ODS tarball files and metadata.
 * @constant {string}
 */
export const CACHE_DIR = path.resolve(
  'packages/manager-tools/manager-muk-cli/target/.cache/ods-tarball',
);

/**
 * Path to the cached tarball contents (JSON representation of all files).
 * @constant {string}
 */
export const TAR_CACHE_FILE = path.join(CACHE_DIR, 'ods-tarball-files.json');

/**
 * Path to the cached metadata file (includes ODS version, checksum, timestamp).
 * @constant {string}
 */
export const META_CACHE_FILE = path.join(CACHE_DIR, 'ods-tarball-meta.json');

/**
 * Base directories
 */
export const MUK_COMPONENTS_PATH = path.resolve('packages/manager-ui-kit');
export const MUK_COMPONENTS_SRC = path.join(MUK_COMPONENTS_PATH, 'src', 'components');

/**
 * Target packages to check and potentially update.
 */
export const TARGET_PACKAGES = [
  '@ovhcloud/ods-components',
  '@ovhcloud/ods-react',
  '@ovhcloud/ods-themes',
];

/**
 * NPM registry base URL for package metadata.
 */
export const NPM_REGISTRY_BASE = 'https://registry.npmjs.org';

/**
 * NPM endpoints for latest ODS React tarball and metadata.
 */
export const ODS_REACT_LATEST_URL = `${NPM_REGISTRY_BASE}/@ovhcloud%2Fods-react/latest`;

/**
 * Log formatting constants
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
};

/**
 * Excluded ODS components
 */
export const ODS_EXCLUDED_COMPONENTS = ['pagination'];
