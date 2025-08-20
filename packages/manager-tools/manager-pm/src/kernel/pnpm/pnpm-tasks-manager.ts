import { consola } from 'consola';
import { execa } from 'execa';

import { managerRootPath } from '../../playbook/pnpm-config.js';
import { updateRootWorkspacesFromCatalogs } from '../commons/catalog-utils.js';
import { resolveBuildFilter } from '../commons/task-utils.js';

/**
 * Build an application (or all apps if no `appRef` provided).
 *
 * Runs `turbo run build` with concurrency set to 5.
 * Adds `--filter` if a specific app reference is provided.
 *
 * @param appRef - Optional application reference to restrict the build.
 * @returns Promise that resolves once the Turbo build process completes.
 */
export async function buildApp(appRef?: string): Promise<void> {
  await updateRootWorkspacesFromCatalogs();

  const args = ['run', 'build', '--concurrency=5'];
  const filter = resolveBuildFilter(appRef);
  if (filter) args.push('--filter', filter);

  consola.info(`▶ turbo ${args.join(' ')}`);
  await execa('turbo', args, { stdio: 'inherit', cwd: managerRootPath });
}

/**
 * Test an application (or all apps if no `appRef` provided).
 *
 * Runs `turbo run test` with concurrency set to 1.
 * Adds `--filter` if a specific app reference is provided.
 *
 * @param appRef - Optional application reference to restrict the test run.
 * @returns Promise that resolves once the Turbo test process completes.
 */
export async function testApp(appRef?: string): Promise<void> {
  await updateRootWorkspacesFromCatalogs();

  const args = ['run', 'test', '--concurrency=1'];
  const filter = resolveBuildFilter(appRef);
  if (filter) args.push('--filter', filter);

  consola.info(`▶ turbo ${args.join(' ')}`);
  await execa('turbo', args, { stdio: 'inherit', cwd: managerRootPath });
}

/**
 * Lint an application using the hybrid legacy+modern lint runner.
 *
 * Under the hood, runs:
 * ```bash
 * yarn lint:tsx -- --app <pkgName>
 * ```
 * where `<pkgName>` is the package name from the app’s `package.json`.
 *
 * @param appRef - Application reference (must resolve to a valid package name).
 * @throws Error if `appRef` is missing or cannot be resolved.
 * @returns Promise that resolves once the lint process completes.
 */
export async function lintApp(appRef: string): Promise<void> {
  if (!appRef) throw new Error('lintApp: appRef is required');

  await updateRootWorkspacesFromCatalogs();

  const pkgName = resolveBuildFilter(appRef);
  if (!pkgName) {
    throw new Error(`Unable to resolve package name for "${appRef}"`);
  }

  const args = ['lint:tsx', '--', '--app', pkgName];

  consola.info(`▶ yarn ${args.join(' ')}`);
  await execa('yarn', args, { stdio: 'inherit', cwd: managerRootPath });
}

/**
 * Build ALL apps (merged Yarn ∪ PNPM catalogs).
 * Equivalent to: update workspaces to merged, then `turbo run build`.
 */
export async function buildAll(): Promise<void> {
  await updateRootWorkspacesFromCatalogs();
  const args = ['run', 'build', '--concurrency=5'];
  consola.info(`▶ turbo ${args.join(' ')}`);
  await execa('turbo', args, { stdio: 'inherit', cwd: managerRootPath });
}

/**
 * Test ALL apps (merged Yarn ∪ PNPM catalogs).
 * Equivalent to: update workspaces to merged, then `turbo run test`.
 */
export async function testAll(): Promise<void> {
  await updateRootWorkspacesFromCatalogs();
  const args = ['run', 'test', '--concurrency=1'];
  consola.info(`▶ turbo ${args.join(' ')}`);
  await execa('turbo', args, { stdio: 'inherit', cwd: managerRootPath });
}

/**
 * Lint ALL apps using the hybrid lint runner.
 * Equivalent to: update workspaces to merged, then `yarn lint:tsx`.
 */
export async function lintAll(): Promise<void> {
  await updateRootWorkspacesFromCatalogs();
  consola.info('▶ yarn lint:tsx');
  await execa('yarn', ['lint:tsx'], { stdio: 'inherit', cwd: managerRootPath });
}
