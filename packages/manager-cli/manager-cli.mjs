#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync } from 'fs';
import path, { resolve } from 'path';

const args = process.argv.slice(2);
const [command, ...restArgs] = args;

/**
 * Known CLI commands and their metadata.
 * @type {Record<string, {script: string, description: string}>}
 */
const knownCommands = {
  'routes-migrate': {
    script: 'json-to-component-route-migration',
    description: 'Migrate React Router config from JSON to JSX components',
  },
  'unit-tests-migrate': {
    script: 'unit-tests-migration',
    description: 'Migrate unit test config (Vitest, Jest...) to shared package',
  },
};

/**
 * Absolute path to the app workspace directory (from monorepo root).
 * Adjusted dynamically via process.cwd().
 * @type {string}
 */
const basePath = path.resolve('../manager/apps');

/**
 * Get all available app names under the `packages/manager/apps` directory.
 * Filters for directories only.
 *
 * @returns {string[]} Array of available app names
 */
const getAvailableApps = () => {
  console.log(`🧭 Scanning apps at: ${basePath}`);

  if (!existsSync(basePath)) {
    console.error(`❌ Directory not found: ${basePath}`);
    return [];
  }

  try {
    const appsDirContent = readdirSync(basePath);
    return appsDirContent.filter((name) => {
      const fullPath = resolve(basePath, name);
      const isDir = statSync(fullPath).isDirectory();
      console.debug(`📁 Found ${isDir ? 'directory' : 'file'}: ${name}`);
      return isDir;
    });
  } catch (error) {
    console.error(`❌ Error reading app directory at ${basePath}`);
    console.error(error);
    return [];
  }
};

/**
 * Display the general help output with commands and usage examples.
 * @returns {void}
 */
const printHelp = () => {
  const commandsList = Object.entries(knownCommands)
    .map(([cmd, meta]) => `  ${cmd.padEnd(20)} ${meta.description}`)
    .join('\n');

  console.log(`
🛠️  manager-cli

Usage:
  yarn manager-cli <command> --app <app-name> [--dry-run]

Options:
  --list                  List available app names
  --help, -h              Show this help message

Commands:
${commandsList}

Examples:
  yarn manager-cli routes-migrate --app pci-ai-tools
  yarn manager-cli routes-migrate --app pci-ai-tools --dry-run

  # Default (vitest)
  yarn manager-cli unit-tests-migrate --app pci-ai-tools

  # Explicit vitest
  yarn manager-cli unit-tests-migrate --app pci-ai-tools --framework vitest

  # Jest
  yarn manager-cli unit-tests-migrate --app zimbra --framework jest --dry-run

  yarn manager-cli --list
  yarn manager-cli --help
`);
};

/**
 * Print the list of available app names.
 * @returns {void}
 */
const listApps = () => {
  const apps = getAvailableApps();
  if (apps.length === 0) {
    console.log('⚠️  No apps found in packages/manager/apps');
    return;
  }

  console.log('\n📦 Available apps:');
  apps.forEach((app) => console.log(`  - ${app}`));
  console.log();
};

// Handle CLI options
if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

if (args.includes('--list')) {
  listApps();
  process.exit(0);
}

// Validate top-level command
if (!command) {
  console.error('❌ No command provided.\n');
  printHelp();
  process.exit(1);
}

const known = knownCommands[command];
if (!known) {
  console.error(`❌ Unknown command: "${command}"\n`);
  printHelp();
  process.exit(1);
}

// Parse flags
const hasDryRun = restArgs.includes('--dry-run');
const appArgIndex = restArgs.findIndex((arg) => arg === '--app');
const appName = appArgIndex !== -1 ? restArgs[appArgIndex + 1] : null;

if (!appName || appName.startsWith('--')) {
  console.error('❌ Missing or invalid --app <app-name> argument.\n');
  printHelp();
  process.exit(1);
}

// Validate app existence
const availableApps = getAvailableApps();
if (!availableApps.includes(appName)) {
  console.error([
    `❌ App "${appName}" not found in:`,
    `   ${basePath}`,
    ``,
    `🔍 Possible causes:`,
    `  - Typo in the app name`,
    `  - App was not cloned or generated properly`,
    `  - Wrong working directory (should be at the root of the monorepo)`,
    ``,
    `📦 Available apps:`,
    ...availableApps.map((app) => `  - ${app}`),
    ``,
    `💡 Tip: Use "yarn manager-cli --list" to see all app names`,
  ].join('\n'));
  process.exit(1);
}

// Build and run final command
const extraFlags = [];

const frameworkArgIndex = restArgs.findIndex((arg) => arg === '--framework');
if (frameworkArgIndex !== -1 && restArgs[frameworkArgIndex + 1]) {
  extraFlags.push('--framework', restArgs[frameworkArgIndex + 1]);
}

if (hasDryRun) extraFlags.push('--dry-run');

/**
 * @type {string}
 */
const runCommand = `yarn run ${known.script} ${appName} ${extraFlags.join(' ')}`;

try {
  console.log(`\n▶ Running "${command}" for app: "${appName}"`);
  console.log(`⏩ Executing: ${runCommand}\n`);
  execSync(runCommand, { stdio: 'inherit' });
} catch (error) {
  console.error(`\n❌ Execution failed for "${command}" on "${appName}".`);
  console.error(error);
  process.exit(1);
}
