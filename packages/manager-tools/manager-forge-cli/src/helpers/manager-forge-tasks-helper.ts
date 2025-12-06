import { spawnSync } from 'node:child_process';

import { logger } from '@ovh-ux/manager-cli-core/logger';

/**
 * Run a CLI command synchronously and stream output to the terminal.
 */
export function runTask(command: string, args: string[]): void {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
  });

  if (result.error) {
    logger.error(`❌ Failed to execute: ${command} ${args.join(' ')}`);
    logger.error(result.error?.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    logger.error(`❌ Command exited with code ${result.status}: ${command} ${args.join(' ')}`);
    process.exit(result.status ?? 1);
  }
}

/**
 * Add the newly forged app to the workspace via Yarn PM.
 * PNPM is the default underlying manager — see the "PNPM Incremental Adoption Guide" for details.
 */
export function addAppToWorkspace(appName: string): void {
  logger.log('\n🧭 Preparing to register the application into the workspace...');
  logger.log(
    '📘 By default, applications are now added under PNPM-managed workspaces.\n' +
      '    For more context or manual setup instructions, refer to the internal documentation:\n' +
      '    👉 "PNPM Incremental Adoption Guide"\n',
  );

  logger.log(`🔗 Adding app "${appName}" to workspace...`);
  runTask('yarn', ['pm:add:app', '--app', appName]);
  logger.log(`✅ App "${appName}" successfully registered in the workspace.`);
}

/**
 * Add the newly forged module to the workspace via Yarn PM.
 * Uses the PNPM-based workspace management tooling.
 *
 * @param {string} moduleName - The module folder name (kebab-case)
 *                              under packages/manager/modules/.
 * @param {boolean} isPrivate - Whether the module should be added as private
 *                              (adds the --private flag).
 */
export function addModuleToWorkspace(moduleName: string, isPrivate: boolean): void {
  logger.log('\n🧭 Preparing to register the module into the workspace...');
  logger.log(
    '📘 Modules are automatically added using the PNPM-managed workspace tooling.\n' +
      '    For more information or manual setup instructions, refer to:\n' +
      '    👉 "PNPM Incremental Adoption Guide"\n',
  );

  const modulePath = `packages/manager/modules/${moduleName}`;

  logger.log(`🔗 Adding module "${moduleName}" to workspace...`);

  const args = ['pm:add:module', '--module', modulePath];
  if (isPrivate) {
    args.push('--private');
  }

  runTask('yarn', args);

  logger.log(`✅ Module "${moduleName}" successfully registered in the workspace.`);
}
