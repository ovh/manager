#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const args = process.argv.slice(2);

// default config unless explicitly passed
const hasCustomConfig = args.some(a => a.startsWith('--config') || a.includes('vitest.config'));
const configArg = hasCustomConfig ? [] : ['--config', './vitest.config.js'];

const isWin = process.platform === 'win32';
const binName = isWin ? 'vitest.cmd' : 'vitest';

// 1) prefer app-local shim
const appBin = join(process.cwd(), 'node_modules', '.bin', binName);

// 2) fallback to the tests-setup’s own node_modules (workspace link)
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, '..'); // .../manager-tests-setup
const fallbackBin = join(pkgRoot, 'node_modules', '.bin', binName);

const vitestBin = existsSync(appBin) ? appBin : fallbackBin;

const child = spawn(vitestBin, [...configArg, ...args], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', code => process.exit(code));
child.on('error', err => {
  console.error('[manager-test] Failed to run vitest:', err);
  process.exit(1);
});
