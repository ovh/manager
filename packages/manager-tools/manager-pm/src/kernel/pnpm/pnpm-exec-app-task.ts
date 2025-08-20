import { runAppTask } from '../commons/task-runner.js';

/**
 * Build an application using Turbo.
 *
 * Wrapper around {@link runAppTask} with `task: "build"`.
 * Ensures the app is temporarily added to Yarn workspaces,
 * resolves its package name (or falls back to the app path),
 * and executes:
 *
 * ```bash
 * turbo run build --filter=<app>
 * ```
 *
 * @param appName - The folder name under `packages/manager/apps/`.
 * @returns A promise resolving when the build completes,
 *          or exits with code 1 on failure.
 */
export const buildApp = (appName: string) => runAppTask({ appName, task: 'build' });

/**
 * Run tests for an application using Turbo.
 *
 * Wrapper around {@link runAppTask} with `task: "test"`.
 * Ensures the app is temporarily added to Yarn workspaces,
 * resolves its package name (or falls back to the app path),
 * and executes:
 *
 * ```bash
 * turbo run test --filter=<app>
 * ```
 *
 * @param appName - The folder name under `packages/manager/apps/`.
 * @returns A promise resolving when tests complete,
 *          or exits with code 1 on failure.
 */
export const testApp = (appName: string) => runAppTask({ appName, task: 'test' });

/**
 * Lint an application using the `lint:tsx` wrapper script.
 *
 * Wrapper around {@link runAppTask} with `task: "lint"`.
 * Ensures the app is temporarily added to Yarn workspaces,
 * resolves its package name (or falls back to the app name),
 * and executes:
 *
 * ```bash
 * yarn lint:tsx -- --app <app>
 * ```
 *
 * @param appName - The folder name under `packages/manager/apps/`.
 * @returns A promise resolving when linting completes,
 *          or exits with code 1 on failure.
 */
export const lintApp = (appName: string) => runAppTask({ appName, task: 'lint' });
