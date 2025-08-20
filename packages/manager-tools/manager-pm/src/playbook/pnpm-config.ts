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

/** Directory where the PNPM store will be placed. */
export const pnpmStorePath: string = path.resolve('./target');

/** Root directory of the monorepo. */
export const managerRootPath = path.resolve(__dirname, '../../../../../..');

/** Path to root package.json (Yarn workspaces). */
export const rootPackageJsonPath = path.join(managerRootPath, 'package.json');

/** Root directory of the manager-pm. */
export const managerPMPath = path.resolve(__dirname, '../../..');

/** Path to apps handled by pnpm (pnpm catalog). */
export const pnpmAppsPlaybookPath = path.join(managerPMPath, 'src/playbook/apps/pnpm-catalog.json');

/** Path to apps handled by yarn (yarn catalog). */
export const yarnAppsPlaybookPath = path.join(managerPMPath, 'src/playbook/apps/yarn-catalog.json');

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
