import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Default PNPM version to download. */
export const pnpmVersion = '10.11.1';

/** Directory where the PNPM binary will be stored. */
export const pnpmBinaryPath: string = path.resolve('./target/pnpm');

/** Basename used for the pnpm binary without platform extension. */
export const pnpmExecutablePath: string = path.join(pnpmBinaryPath, 'pnpm');

/** Root directory of the monorepo. */
export const managerRootPath = path.resolve(__dirname, '../../../../../..');

/** Path to root package.json (Yarn workspaces). */
export const rootPackageJsonPath = path.join(managerRootPath, 'package.json');

/** Root directory of the manager-pm. */
export const managerPMPath = path.resolve(__dirname, '../../..');

/** Path to pnpm migrated apps registry. */
export const migratePnpmAppsPath = path.join(managerPMPath, 'src/playbook/pnpm-migrated-apps.json');
