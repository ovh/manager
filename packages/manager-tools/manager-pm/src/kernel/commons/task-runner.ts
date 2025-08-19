import { consola } from 'consola';
import { execSync } from 'node:child_process';

import { buildAppPath, buildAppPkgJsonPath, managerRootPath } from '../../playbook/pnpm-config.js';
import type { PackageJsonType } from '../types/commons/package-json-type.js';
import { TaskCommand, TaskCommandOptions, TaskOptions } from '../types/commons/task-type.js';
import { loadJson } from './json-utils.js';
import { addAppToYarnWorkspaces, removeAppFromYarnWorkspaces } from './workspace-utils.js';

/**
 * Compute the shell command and description for a given app task.
 * Also logs the command about to be executed.
 */
export function getAppTaskCommand({
  task,
  appName,
  packageName,
  appPath,
}: TaskCommandOptions): TaskCommand {
  let result: TaskCommand;

  if (task === 'build' || task === 'test') {
    const filter = packageName ?? `./${appPath}`;
    result = {
      command: `turbo run ${task} --filter=${filter}...`,
      description: `Turbo ${task} with filter: ${filter}`,
    };
  } else if (task === 'lint') {
    const target = packageName ?? appName;
    const args = ['lint:tsx', '--', '--app', target];
    result = {
      command: `yarn ${args.join(' ')}`,
      description: `yarn ${args.join(' ')}`,
    };
  } else if (task === 'start') {
    const filter = packageName ?? `./${appPath}`;
    return {
      command: `turbo run start --filter=${filter}...`,
      description: `Turbo start with filter: ${filter}`,
    };
  } else {
    throw new Error(`Unknown task: ${task as string}`);
  }

  // Log once for every command built
  consola.info(`▶ Command to execute: ${result.command}`);

  return result;
}

/**
 * Common runner for app tasks.
 * Handles Yarn workspace add/remove, package.json name detection, and cleanup.
 */
export async function runAppTask({ appName, task }: TaskOptions): Promise<void> {
  consola.start(`🚀 Starting ${task} for app "${appName}"`);

  const appPath = buildAppPath(appName);
  const appPkgJsonPath = buildAppPkgJsonPath(appPath);

  await addAppToYarnWorkspaces(appPath);

  let packageName: string | undefined;
  try {
    consola.info(`📖 Reading app package.json from: ${appPkgJsonPath}`);
    const appPkg = await loadJson<PackageJsonType>(appPkgJsonPath);

    if (appPkg.name) {
      packageName = appPkg.name;
      consola.success(`✔ Detected package name: ${packageName}`);
    } else {
      consola.warn(`⚠ No "name" field in package.json, will fallback to appName/path.`);
    }
  } catch (err) {
    consola.error(`❌ Failed to read app package.json: ${(err as Error).message}`);
    await removeAppFromYarnWorkspaces(appPath);
    process.exit(1);
  }

  try {
    const { command, description } = getAppTaskCommand({ task, appName, packageName, appPath });
    consola.info(`▶ Running: ${description}...`);

    execSync(command, {
      stdio: 'inherit',
      cwd: managerRootPath,
    });

    consola.success(`✅ ${task} completed for "${appName}"`);
  } catch {
    consola.error(`❌ ${task} failed for "${appName}"`);
    process.exit(1);
  } finally {
    await removeAppFromYarnWorkspaces(appPath);
    consola.box(`🎉 ${task} flow complete for app "${appName}"`);
  }
}
