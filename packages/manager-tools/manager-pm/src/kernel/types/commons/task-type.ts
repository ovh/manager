/**
 * The high-level tasks supported for apps.
 */
export type TaskType = 'build' | 'test' | 'lint' | 'start';

/**
 * Options passed to `runAppTask`.
 * - `appName` is always required.
 * - `task` must be one of the supported `TaskType`s.
 */
export interface TaskOptions {
  task: TaskType;
  appName: string;
}

/**
 * Extended options required to compute the exact command string.
 * - `packageName` is optional (may be read from package.json).
 * - `appPath` must always be resolved before calling.
 */
export interface TaskCommandOptions extends TaskOptions {
  packageName?: string;
  appPath: string;
}

/**
 * Return type from `getAppTaskCommand`.
 */
export interface TaskCommand {
  command: string; // exact shell command to run
  description: string; // human-friendly description for logging
}
