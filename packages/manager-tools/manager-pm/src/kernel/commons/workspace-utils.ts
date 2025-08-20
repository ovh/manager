import { consola } from 'consola';
import { execa } from 'execa';
import { existsSync, readdirSync } from 'fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { basename } from 'path';

import {
  applicationsBasePath,
  cleanupDirectories,
  rootPackageJsonPath,
} from '../../playbook/pnpm-config.js';
import { PackageJsonType } from '../types/commons/package-json-type.js';
import { Application, YarnWorkspaceInfo } from '../types/commons/workspace-type.js';
import { parseJson } from '../utils/json-utils.js';
import { parseAppPackageJson } from './json-utils.js';

/**
 * Ensure an app path is present in Yarn workspaces.
 */
export async function addAppToYarnWorkspaces(appPath: string): Promise<void> {
  const pkgRaw = await fs.readFile(rootPackageJsonPath, 'utf-8');
  const pkg = parseJson<PackageJsonType>(pkgRaw);

  if (!pkg.workspaces?.packages) {
    throw new Error('Root package.json missing workspaces.packages');
  }

  if (!pkg.workspaces.packages.includes(appPath)) {
    pkg.workspaces.packages.push(appPath);
    pkg.workspaces.packages.sort();
    await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
    consola.success(`✔ Added "${appPath}" back to Yarn workspaces`);
  } else {
    consola.info(`ℹ "${appPath}" already exists in Yarn workspaces`);
  }
}

/**
 * Ensure an app path is removed from Yarn workspaces.
 */
export async function removeAppFromYarnWorkspaces(appPath: string): Promise<void> {
  const pkgRaw = await fs.readFile(rootPackageJsonPath, 'utf-8');
  const pkg = parseJson<PackageJsonType>(pkgRaw);

  if (!pkg.workspaces?.packages) {
    throw new Error('Root package.json missing workspaces.packages');
  }

  if (pkg.workspaces.packages.includes(appPath)) {
    pkg.workspaces.packages = pkg.workspaces.packages.filter((p) => p !== appPath);
    await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
    consola.success(`✔ Removed "${appPath}" from Yarn workspaces`);
  } else {
    consola.info(`ℹ "${appPath}" already absent in Yarn workspaces`);
  }
}

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
