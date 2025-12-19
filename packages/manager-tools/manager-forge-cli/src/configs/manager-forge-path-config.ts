import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Resolves __dirname for ESM modules.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Base paths.
 */
const ROOT_DIR = path.resolve(__dirname, '../../../../..');

/**
 * Applications related paths.
 */
export const APPLICATIONS_FOLDER_PATH = 'packages/manager/apps';
export const MANAGER_APPLICATIONS_DIR = path.join(ROOT_DIR, 'manager/apps');
export const APPLICATION_TEMPLATE_DIR = path.join(
  ROOT_DIR,
  'manager-tools/manager-forge-cli/templates/application',
);

/**
 * Modules related paths.
 */
export const MODULES_FOLDER_PATH = 'packages/manager/modules';
export const MANAGER_MODULES_DIR = path.join(ROOT_DIR, 'manager/modules');
export const MODULE_TEMPLATE_DIR = path.join(
  ROOT_DIR,
  'manager-tools/manager-forge-cli/templates/module',
);

/**
 * Modern lint ignore targets
 */
export const IGNORE_TARGETS = [
  { file: '.eslintignore', label: 'ESLint' },
  { file: '.prettierignore', label: 'Prettier' },
  { file: '.stylelintignore', label: 'Stylelint' },
];
