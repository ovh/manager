#!/usr/bin/env node
import { spawn } from 'child_process';

const args = process.argv.slice(2);

// Use default config unless explicitly passed
const hasCustomConfig = args.some(
  (arg) => arg.startsWith('--config') || arg.includes('vitest.config.js'),
);
const configArg = hasCustomConfig ? [] : ['--config', './vitest.config.js'];

const command = 'yarn';
const commandArgs = ['vitest', ...configArg, ...args];

// Spawn the CLI
const child = spawn(command, commandArgs, {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env,
});

// Exit handling
child.on('exit', (code) => process.exit(code));
child.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[manager-test] Failed to run vitest:', err);
  process.exit(1);
});
