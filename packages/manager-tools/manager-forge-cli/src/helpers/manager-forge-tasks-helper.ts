import { spawnSync } from 'node:child_process';

/**
 * Run a CLI command synchronously and stream output to the terminal.
 */
export function runTask(command: string, args: string[]): void {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
  });

  if (result.error) {
    console.error(`❌ Failed to execute: ${command} ${args.join(' ')}`);
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`❌ Command exited with code ${result.status}: ${command} ${args.join(' ')}`);
    process.exit(result.status ?? 1);
  }
}

/**
 * Add the newly forged app to the workspace via Yarn PM.
 * PNPM is the default underlying manager — see the "PNPM Incremental Adoption Guide" for details.
 */
export function addAppToWorkspace(appName: string): void {
  console.log('\n🧭 Preparing to register the application into the workspace...');
  console.log(
    '📘 By default, applications are now added under PNPM-managed workspaces.\n' +
      '    For more context or manual setup instructions, refer to the internal documentation:\n' +
      '    👉 "PNPM Incremental Adoption Guide"\n',
  );

  console.log(`🔗 Adding app "${appName}" to workspace...`);
  runTask('yarn', ['pm:add:app', '--app', appName]);
  console.log(`✅ App "${appName}" successfully registered in the workspace.`);
}
