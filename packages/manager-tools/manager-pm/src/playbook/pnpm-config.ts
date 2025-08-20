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

/** Path to pnpm normalized versions path. */
export const normalizedVersionsPath = path.join(
  managerPMPath,
  'src/playbook/pnpm-normalized-versions',
);

/**
 * Applications root path
 */
export const applicationsBasePath = 'packages/manager/apps';

/**
 * Compute the relative path of an app inside the monorepo.
 *
 * @param appName - The folder name under `applicationsBasePath`
 * @returns The relative path to the app (e.g. "applicationsBasePath/zimbra")
 */
export const buildAppPath = (appName: string): string => path.join(applicationsBasePath, appName);

/**
 * Compute the absolute path to an app's package.json.
 *
 * @param appPath - The relative app path as returned by {@link buildAppPath}
 * @returns The absolute path to the app's package.json file
 */
export const buildAppPkgJsonPath = (appPath: string): string =>
  path.join(managerRootPath, appPath, 'package.json');

/**
 * Directories that should always be ignored when recursively scanning
 * for `package.json` files (e.g. build artifacts, dependencies, VCS).
 */
export const ignoredDirectories = new Set(['node_modules', 'dist', 'coverage', '.git']);

/**
 * Root directories under the monorepo where private packages
 * (core, modules, components) are expected to be located.
 */
export const privateWorkspaces = [
  'packages/manager/core',
  'packages/manager/modules',
  'packages/components',
];

/**
 * Folders to remove before installation.
 */
export const cleanupDirectories: readonly string[] = ['node_modules', 'dist', '.turbo'];

/**
 * Container application package name.
 */
export const containerPackageName = '@ovh-ux/manager-container-app';
