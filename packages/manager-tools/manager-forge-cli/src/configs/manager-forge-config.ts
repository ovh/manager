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
export const MANAGER_APPLICATIONS_DIR = path.join(ROOT_DIR, 'manager/apps');
export const APPLICATION_TEMPLATE_DIR = path.join(
  ROOT_DIR,
  'manager-tools/manager-forge-cli/template/application',
);

/**
 * Modules related paths.
 */
export const MODULE_TEMPLATE_DIR = path.join(
  ROOT_DIR,
  'manager-tools/manager-forge-cli/template/module',
);
