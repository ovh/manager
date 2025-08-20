import { consola } from 'consola';
import { execa } from 'execa';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { basename } from 'path';

import {
  applicationsBasePath,
  cleanupDirectories,
  managerRootPath,
} from '../../playbook/pnpm-config.js';
import {
  AbsolutePath,
  AppRef,
  Application,
  PackageName,
  WorkspacePath,
  YarnWorkspaceInfo,
} from '../types/commons/workspace-type.js';
import { parseAppPackageJson } from './json-utils.js';

/**
 * Clean up existing build and dependency folders in an app.
 *
 * Removes:
 *  - node_modules
 *  - dist
 *  - .turbo (Turbo cache)
 *
 * @param appPath - Absolute path to the app folder
 */
export async function cleanAppDirs(appPath: string): Promise<void> {
  for (const directory of cleanupDirectories) {
    const fullPath = path.join(appPath, directory);
    try {
      await fs.rm(fullPath, { recursive: true, force: true });
      consola.info(`🧹 [cleanup] Removed ${fullPath}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      consola.warn(`⚠️ [cleanup] Failed to remove ${fullPath}: ${message}`);
    }
  }
}

/**
 * Get application ID (directory basename) from Yarn workspaces info.
 */
export async function getApplicationId(packageName: string): Promise<string> {
  const { stdout } = await execa('yarn', ['workspaces', 'info']);
  const info = JSON.parse(stdout) as Record<string, YarnWorkspaceInfo>;

  const workspace = info[packageName];
  if (!workspace) {
    throw new Error(`Workspace info not found for package: ${packageName}`);
  }

  return basename(workspace.location);
}

/**
 * List all applications available for a given workspace.
 */
export function getApplications(): Application[] {
  return readdirSync(applicationsBasePath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map(({ name }) => ({ application: name }))
    .filter(({ application }) =>
      existsSync(path.join(applicationsBasePath, application, 'package.json')),
    )
    .map(({ application }) => {
      const pkgPath = path.join(applicationsBasePath, application, 'package.json');
      const { name, regions } = parseAppPackageJson(pkgPath);

      // Already validated name is string
      if (!name.includes('/')) {
        throw new Error(`Invalid package name "${name}" in ${pkgPath}`);
      }

      const [, formattedName] = name.split('/');

      return {
        name: formattedName || '',
        value: name,
        regions,
      } satisfies Application;
    });
}

/**
 * Convert a filesystem path into POSIX format (forward slashes).
 */
function toPosix(p: string): string {
  return p.split(path.sep).join(path.posix.sep);
}

/**
 * Check if the given path string is likely a workspace-relative path.
 */
function isLikelyWorkspacePath(p: string): boolean {
  const x = toPosix(p);
  return x.startsWith('packages/') || x.startsWith('./packages/');
}

/**
 * Strip the repository root from an absolute path, returning a workspace-relative path.
 */
function stripRepoRoot(absPath: AbsolutePath): WorkspacePath {
  const rootPosix = toPosix(managerRootPath).replace(/\/+$/, '');
  const absPosix = toPosix(absPath);
  return absPosix.startsWith(rootPosix + '/') ? absPosix.slice(rootPosix.length + 1) : absPosix;
}

/**
 * List absolute paths of all valid app directories under `packages/manager/apps`.
 */
function listAppDirsAbs(): AbsolutePath[] {
  const appsAbs = path.join(managerRootPath, applicationsBasePath);
  if (!existsSync(appsAbs)) return [];
  return readdirSync(appsAbs)
    .map((d) => path.join(appsAbs, d))
    .filter((p) => {
      try {
        return statSync(p).isDirectory() && existsSync(path.join(p, 'package.json'));
      } catch {
        return false;
      }
    });
}

/**
 * Find an app directory by its package.json `"name"`.
 */
function findByPackageName(pkgName: PackageName): WorkspacePath | null {
  for (const dirAbs of listAppDirsAbs()) {
    try {
      const raw = readFileSync(path.join(dirAbs, 'package.json'), 'utf-8');
      const pkg = JSON.parse(raw) as { name?: string };
      if (pkg?.name === pkgName) {
        return stripRepoRoot(dirAbs);
      }
    } catch {
      // ignore invalid package.json
    }
  }
  return null;
}

/**
 * Resolve an "app reference" (folder name, package name, workspace path,
 * or absolute path) to a workspace-relative POSIX path:
 *   "packages/manager/apps/<appName>"
 */
export function buildAppWorkspacePath(appRef: AppRef): WorkspacePath {
  if (!appRef) throw new Error('buildAppWorkspacePath: appRef is required');

  // Case 1: workspace-style input (or './packages/...').
  if (isLikelyWorkspacePath(appRef)) {
    return toPosix(appRef).replace(/^\.\//, '');
  }

  // Case 2: absolute filesystem path → normalize back to workspace path.
  if (path.isAbsolute(appRef)) {
    const rel = stripRepoRoot(appRef);
    const relPosix = toPosix(rel);
    if (!relPosix.startsWith(applicationsBasePath + '/')) {
      throw new Error(`Path is not under ${applicationsBasePath}: ${appRef}`);
    }
    return relPosix;
  }

  // Case 3: package name (@scope/name) → find matching app folder.
  if (appRef.startsWith('@')) {
    const rel = findByPackageName(appRef);
    if (rel) return toPosix(rel);
    throw new Error(`Could not resolve package "${appRef}" under ${applicationsBasePath}`);
  }

  // Case 4: bare folder name → construct canonical workspace path.
  return path.posix.join(applicationsBasePath, appRef);
}

/**
 * Get the absolute filesystem path to the app folder for any accepted `appRef`.
 */
export function buildAppAbsolutePath(appRef: AppRef): AbsolutePath {
  const rel = buildAppWorkspacePath(appRef);
  return path.join(managerRootPath, rel);
}

/**
 * Safely resolve the package name (`"name"` field in package.json)
 * for any accepted `appRef`.
 */
export function getPackageNameFromApp(appRef: AppRef): PackageName | null {
  try {
    const abs = buildAppAbsolutePath(appRef);
    const raw = readFileSync(path.join(abs, 'package.json'), 'utf-8');
    const pkg = JSON.parse(raw) as { name?: string };
    return pkg?.name ?? null;
  } catch {
    return null;
  }
}
