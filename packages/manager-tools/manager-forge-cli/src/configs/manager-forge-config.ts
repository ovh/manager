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
export const APPS_DIR = path.join(ROOT_DIR, 'manager/apps');
export const TEMPLATE_DIR = path.join(
  ROOT_DIR,
  'manager-tools/manager-forge-cli/template',
);
