#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import process, { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { logError, logInfo } from './cli-utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const userCwd = cwd();
const eslintBin = resolve(__dirname, '../node_modules/.bin/eslint');

const args = process.argv.slice(2);
const hasExplicitConfigArg = args.includes('--config');
const localConfigPath = join(userCwd, 'eslint.config.ts');
const sharedDefaultPath = resolve(
  __dirname,
  '../dist/adapters/eslint/config/eslint-shared-config.js',
);
const hasLocalConfig = existsSync(localConfigPath);

// Determine effective config path
const configPath = hasExplicitConfigArg
  ? args[args.indexOf('--config') + 1]
  : hasLocalConfig
    ? localConfigPath
    : sharedDefaultPath;

// Helper: wrap spawn in a promise
function runLint(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd,
      shell: true,
    });

    child.on('error', (err) => {
      logError('[manager-lint] Failed to run ESLint');
      logError(err);
      reject(1);
    });

    child.on('close', (code) => {
      resolve(code ?? 1);
    });
  });
}

(async () => {
  // Handle --print-config
  if (args.includes('--print-config')) {
    const url = pathToFileURL(configPath).href;
    try {
      const mod = await import(url);
      const configContent = mod.default ?? mod;
      logInfo('[manager-lint] Loaded ESLint config from:', configPath);
      console.dir(configContent, { depth: null });
    } catch (err) {
      logError(`[manager-lint] Failed to load config at ${configPath}`);
      logError(err);
      process.exit(1);
    }
    process.exit(0);
  }

  // Construct full args
  const fullArgs =
    hasExplicitConfigArg || hasLocalConfig ? args : ['--config', sharedDefaultPath, ...args];

  // Run ESLint using tsx and wait for completion
  const exitCode = await runLint('tsx', [eslintBin, ...fullArgs], userCwd);
  process.exit(exitCode);
})();
