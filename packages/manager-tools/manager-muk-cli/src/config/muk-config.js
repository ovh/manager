/**
 * CLI configuration constants for manager-muk-cli.
 *
 * Keeping all shared constants and paths in one place ensures that the
 * different commands (checkVersions, checkComponents, update) remain aligned.
 */
import path from 'node:path';

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
  check: '✔',
  warn: '⚠',
  package: '📦',
  folder: '📁',
  info: 'ℹ',
};
