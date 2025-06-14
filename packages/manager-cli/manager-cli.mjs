#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync } from 'fs';
import path, { resolve } from 'path';

const args = process.argv.slice(2);
const [command, ...restArgs] = args;

// Known commands and metadata
const knownCommands = {
  'routes-migrate': {
    script: 'json-to-component-route-migration',
    description: 'Migrate React Router config from JSON to JSX components',
    help: `
# Migrate routes and affecting files
yarn manager-cli routes-migrate --app zimbra

# Preview changes without affecting files
yarn manager-cli routes-migrate --app zimbra --dry-run`
  },
  'tests-migrate': {
    script: 'common-tests-config-migration',
    description: 'Migrate test setup (unit, integration...) to centralized shared configuration (Vitest, Jest...)',
    help: `
# Migrate a unit test setup with Vitest (affect files)
yarn manager-cli tests-migrate --app zimbra --testType unit

# Migrate an integration test setup with Jest (affect files)
yarn manager-cli tests-migrate --app zimbra --testType integration --framework jest

# Preview changes without applying them (without affecting files)
yarn manager-cli tests-migrate --app zimbra --testType unit --dry-run`
  },
  'pkg-manager-migrate': {
    script: 'pkg-manager-migrate',
    description: 'Migrate a specific app to a new package manager (e.g., pnpm)',
    help: `
# Migrate an app from Yarn to PNPM
yarn manager-cli pkg-manager-migrate --app zimbra --type pnpm

# Dry-run preview
yarn manager-cli pkg-manager-migrate --app zimbra --type pnpm --dry-run`,
  },
};

const validTestTypes = ['unit', 'integration'];
const validPkgManagerTypes = ['pnpm'];
const basePath = path.resolve('../manager/apps');

const getAvailableApps = () => {
  if (!existsSync(basePath)) {
    console.error(`❌ Directory not found: ${basePath}`);
    return [];
  }

  try {
    const appsDirContent = readdirSync(basePath);
    return appsDirContent.filter((name) => {
      const fullPath = resolve(basePath, name);
      return statSync(fullPath).isDirectory();
    });
  } catch (error) {
    console.error(`❌ Error reading app directory at ${basePath}`);
    console.error(error);
    return [];
  }
};

const printHelp = () => {
  const commandsList = Object.entries(knownCommands)
    .map(([cmd, meta]) => `  ${cmd.padEnd(20)} ${meta.description}`)
    .join('\n');
  const commandsHelp = Object.entries(knownCommands)
    .map(([_, meta]) => meta.help)
    .join('\n');

  console.log(`
🛠️  manager-cli

Usage:
  yarn manager-cli <command> --app <app-name> [--testType <unit|integration>] [--framework <name>] [--dry-run]

Options:
  --list                  List available app names
  --help, -h              Show this help message

Commands:
${commandsList}

Examples:
  ${commandsHelp}

------------------------------------------------------------------------------------------
  yarn manager-cli --list
  yarn manager-cli --help
------------------------------------------------------------------------------------------
`);
};

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

// Handle --help and --list
if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}
if (args.includes('--list')) {
  listApps();
  process.exit(0);
}

// Validate command
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

// Validate app
const hasDryRun = restArgs.includes('--dry-run');
const appArgIndex = restArgs.findIndex((arg) => arg === '--app');
const appName = appArgIndex !== -1 ? restArgs[appArgIndex + 1] : null;

if (!appName || appName.startsWith('--')) {
  console.error('❌ Missing or invalid --app <app-name> argument.\n');
  printHelp();
  process.exit(1);
}

const availableApps = getAvailableApps();
if (!availableApps.includes(appName)) {
  console.error([
    `❌ App "${appName}" not found in:`,
    `   ${basePath}`,
    '',
    `📦 Available apps:`,
    ...availableApps.map((a) => `  - ${a}`),
    '',
    `💡 Tip: Use "yarn manager-cli --list" to see all app names`,
  ].join('\n'));
  process.exit(1);
}

// Handle additional flags
const extraFlags = [];

const frameworkArgIndex = restArgs.findIndex((arg) => arg === '--framework');
if (frameworkArgIndex !== -1 && restArgs[frameworkArgIndex + 1]) {
  extraFlags.push('--framework', restArgs[frameworkArgIndex + 1]);
}

if (hasDryRun) extraFlags.push('--dry-run');

// Handle --testType for tests-migrate only
if (command === 'tests-migrate') {
  let testType = null;
  const typeArgIndex = restArgs.findIndex((arg) => arg === '--testType');
  if (typeArgIndex !== -1 && restArgs[typeArgIndex + 1]) {
    testType = restArgs[typeArgIndex + 1];
  }

  if (!testType) {
    console.error(`❌ Missing required flag: --testType <unit|integration>`);
    process.exit(1);
  }
  if (!validTestTypes.includes(testType)) {
    console.error(`❌ Invalid --testType "${testType}". Must be one of: ${validTestTypes.join(', ')}`);
    process.exit(1);
  }
  extraFlags.push('--testType', testType);
}

//
if (command === 'pkg-manager-migrate') {
  let pckManagerType = null;
  const typeArgIndex = restArgs.findIndex((arg) => arg === '--type');
  if (typeArgIndex !== -1 && restArgs[typeArgIndex + 1]) {
    pckManagerType = restArgs[typeArgIndex + 1];
  }

  if (!pckManagerType) {
    console.error(`❌ Missing required flag: --type <${validPkgManagerTypes.join('|')}>`);
    process.exit(1);
  }
  if (!validPkgManagerTypes.includes(pckManagerType)) {
    console.error(`❌ Invalid --type "${pckManagerType}". Must be one of: ${validPkgManagerTypes.join(', ')}`);
    process.exit(1);
  }
  extraFlags.push('--type', restArgs[typeArgIndex + 1]);
}

// Final command
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
