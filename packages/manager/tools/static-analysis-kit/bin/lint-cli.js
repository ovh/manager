#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve, join } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));
const userCwd = cwd();
const eslintBin = resolve(__dirname, '../node_modules/.bin/eslint');

const args = process.argv.slice(2);
const hasExplicitConfigArg = args.includes('--config');
const localConfigPath = join(userCwd, 'eslint.config.ts');
const sharedDefaultPath = resolve(__dirname, '../dist/adapters/eslint/config/eslint.config.js');
const hasLocalConfig = existsSync(localConfigPath);

// Determine effective config path
// eslint-disable-next-line no-nested-ternary
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
      console.error('[manager-lint] Failed to run ESLint');
      console.error(err);
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
      console.log('[manager-lint] Loaded ESLint config from:', configPath);
      console.dir(configContent, { depth: null });
    } catch (err) {
      console.error(`[manager-lint] Failed to load config at ${configPath}`);
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  }

  // Construct full args
  const fullArgs = hasExplicitConfigArg || hasLocalConfig
    ? args
    : ['--config', sharedDefaultPath, ...args];

  // Run ESLint using tsx and wait for completion
  const exitCode = await runLint('tsx', [eslintBin, ...fullArgs], userCwd);
  process.exit(exitCode);
})();
