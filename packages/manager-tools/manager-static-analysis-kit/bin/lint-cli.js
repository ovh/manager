#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import process, { cwd, execPath } from 'node:process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { logError, logInfo } from './utils/log-utils.js';

/**
 * manager-lint
 * - Uses ESLint's real JS entry (no platform-specific .bin)
 * - Auto-picks config: --config arg > local eslint.config.* > shared default
 * - Supports TS flat config by preloading tsx only when needed
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const userCwd = cwd();

// ---------------------------------------------------------------------------
// Resolve ESLint CLI entry (avoid .bin shims)
// ---------------------------------------------------------------------------
let eslintCli;
try {
  eslintCli = resolve(require.resolve('eslint/package.json'), '../bin/eslint.js');
} catch {
  logError('[manager-lint] Could not resolve "eslint". Is it installed in this package?');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Args & config
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

const hasFlag = (name) => args.includes(name);
const getFlagValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const firstNonFlag = () => args.find((a) => !a.startsWith('--'));

const hasExplicitConfig = hasFlag('--config');
const localConfigCandidates = [
  'eslint.config.ts', 'eslint.config.mts', 'eslint.config.cts',
  'eslint.config.mjs', 'eslint.config.cjs', 'eslint.config.js',
];
const localConfigPath = localConfigCandidates
  .map((f) => join(userCwd, f))
  .find((p) => existsSync(p));

const sharedDefaultPath = resolve(__dirname, '../dist/adapters/eslint/config/eslint-shared-config.js');

const configPath = hasExplicitConfig ? getFlagValue('--config') : (localConfigPath ?? sharedDefaultPath);

// ---------------------------------------------------------------------------
// Node preload for TS configs
// ---------------------------------------------------------------------------
const needsTsx = /\.(?:mts|cts|ts)$/i.test(configPath || '');
const nodeMajor = Number(process.versions.node.split('.')[0]);

if (needsTsx) {
  // Fail fast with a clear message if tsx isn't available
  try {
    require.resolve('tsx');
  } catch {
    logError('[manager-lint] A TypeScript eslint config was detected, but "tsx" is not installed.');
    logError('Install it in @ovh-ux/manager-static-analysis-kit (or the invoking package) and retry.');
    process.exit(1);
  }
}

const nodePreload = needsTsx
  ? (nodeMajor >= 20 ? ['--import', 'tsx'] : ['--loader', 'tsx'])
  : [];

// ---------------------------------------------------------------------------
// Build final ESLint argv
//  - If the user didn’t pass --config, inject our chosen config
// ---------------------------------------------------------------------------
const forwarded = hasExplicitConfig ? args : ['--config', configPath, ...args];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------
function run(procArgs) {
  return new Promise((resolveCode) => {
    const child = spawn(execPath, procArgs, {
      cwd: userCwd,
      stdio: 'inherit',
      shell: false,
    });
    child.on('error', (err) => {
      logError('[manager-lint] Failed to run ESLint');
      logError(err);
      resolveCode(1);
    });
    child.on('close', (code) => resolveCode(code ?? 1));
  });
}

// ---------------------------------------------------------------------------
// --print-config (delegate to ESLint)
// ESLint requires a target file after --print-config. Use the first non-flag
// argument or default to "." if none was provided.
// ---------------------------------------------------------------------------
if (hasFlag('--print-config')) {
  const target = firstNonFlag() ?? '.';
  logInfo('[manager-lint] Using config:', configPath);
  const code = await run([...nodePreload, eslintCli, '--config', configPath, '--print-config', target]);
  process.exit(code);
}

// ---------------------------------------------------------------------------
// Normal run
// ---------------------------------------------------------------------------
const code = await run([...nodePreload, eslintCli, ...forwarded]);
process.exit(code);
