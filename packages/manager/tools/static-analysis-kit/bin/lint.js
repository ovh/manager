#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve, join } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const userCwd = cwd();
const eslintBin = resolve(__dirname, '../node_modules/.bin/eslint');

const args = process.argv.slice(2);
const hasExplicitConfigArg = args.includes('--config');
const localConfigPath = join(userCwd, 'eslint.config.ts');
const sharedDefaultPath = resolve(__dirname, '../dist/adapters/eslint/config/eslint.config.js');
const hasLocalConfig = existsSync(localConfigPath);

// Determine effective config path
const configPath = hasExplicitConfigArg
  ? args[args.indexOf('--config') + 1]
  : hasLocalConfig
    ? localConfigPath
    : sharedDefaultPath;

// Load and print config content if --debug-config-content is passed
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
  }
}

// Construct final args
const fullArgs = hasExplicitConfigArg || hasLocalConfig
  ? args
  : ['--config', sharedDefaultPath, ...args];

// Run ESLint via tsx
spawn('tsx', [eslintBin, ...fullArgs], {
  stdio: 'inherit',
  cwd: userCwd,
});
