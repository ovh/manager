import { spawn } from "node:child_process";

import { managerRootPath } from "../../playbook/pnpm-config.js";
import { updateRootWorkspacesFromCatalogs } from "../commons/catalog-utils.js";
import { resolveBuildFilter } from "../commons/task-utils.js";
import { logger } from '../commons/log-manager.js';

/**
 * Spawn a child process and run a command with streamed output.
 *
 * This is a lightweight wrapper around Node's `child_process.spawn`
 * that:
 * - streams stdout/stderr directly to the parent process (via `stdio: "inherit"`),
 * - rejects on non-zero exit codes or process errors,
 * - resolves once the process exits successfully.
 *
 * @param {string} cmd - The command to run (e.g., `"turbo"` or `"yarn"`).
 * @param {string[]} args - List of arguments to pass to the command.
 * @param {string} cwd - The working directory to run the command in.
 * @returns {Promise<void>} Promise that resolves when the command exits with code 0, rejects otherwise.
 */
function runCommand(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd,
      stdio: "inherit", // stream output directly
    });

    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${cmd} ${args.join(" ")} failed with exit code ${code}`));
      }
    });
  });
}

/**
 * Build an application (or all apps if no `appRef` provided).
 */
export async function buildApp(appRef) {
  await updateRootWorkspacesFromCatalogs();

  const args = ["run", "build", "--concurrency=5"];
  const filter = resolveBuildFilter(appRef);
  if (filter) args.push("--filter", filter);

  logger.info(`▶ turbo ${args.join(" ")}`);
  await runCommand("turbo", args, managerRootPath);
}

/**
 * Test an application (or all apps if no `appRef` provided).
 */
export async function testApp(appRef) {
  await updateRootWorkspacesFromCatalogs();

  const args = ["run", "test", "--concurrency=1"];
  const filter = resolveBuildFilter(appRef);
  if (filter) args.push("--filter", filter);

  logger.info(`▶ turbo ${args.join(" ")}`);
  await runCommand("turbo", args, managerRootPath);
}

/**
 * Lint an application using the hybrid legacy+modern lint runner.
 */
export async function lintApp(appRef) {
  if (!appRef) throw new Error("lintApp: appRef is required");

  await updateRootWorkspacesFromCatalogs();

  const pkgName = resolveBuildFilter(appRef);
  if (!pkgName) {
    throw new Error(`Unable to resolve package name for "${appRef}"`);
  }

  const args = ["lint:tsx", "--", "--app", pkgName];

  logger.info(`▶ yarn ${args.join(" ")}`);
  await runCommand("yarn", args, managerRootPath);
}

/**
 * Build ALL apps.
 */
export async function buildAll() {
  await updateRootWorkspacesFromCatalogs();
  const args = ["run", "build", "--concurrency=5"];
  logger.info(`▶ turbo ${args.join(" ")}`);
  await runCommand("turbo", args, managerRootPath);
}

/**
 * Test ALL apps.
 */
export async function testAll() {
  await updateRootWorkspacesFromCatalogs();
  const args = ["run", "test", "--concurrency=1"];
  logger.info(`▶ turbo ${args.join(" ")}`);
  await runCommand("turbo", args, managerRootPath);
}

/**
 * Lint ALL apps.
 */
export async function lintAll() {
  await updateRootWorkspacesFromCatalogs();
  logger.info("▶ yarn lint:tsx");
  await runCommand("yarn", ["lint:tsx"], managerRootPath);
}
