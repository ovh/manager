#!/usr/bin/env node

import { execSync } from 'child_process';
import { applicationsBasePath, getAvailableApps } from './utils/AppUtils.mjs';

const args = process.argv.slice(2);
const [command, ...restArgs] = args;

// Known commands and metadata
const knownCommands = {
  'routes-migrate': {
    script: 'json-to-component-route-migration',
    isAppRequired: true,
    description: 'Migrate React Router config from JSON to JSX components',
    help: `
# Migrate routes and affecting files
yarn manager-cli routes-migrate --app zimbra

# Preview changes without affecting files
yarn manager-cli routes-migrate --app zimbra --dry-run`
  },
  'tests-migrate': {
    script: 'common-tests-config-migration',
    isAppRequired: true,
    description: 'Migrate test setup (unit, integration...) to centralized shared configuration (Vitest, Jest...)',
    help: `
# Migrate a unit test setup with Vitest (affect files)
yarn manager-cli tests-migrate --app zimbra --testType unit

# Migrate an integration test setup with Jest (affect files)
yarn manager-cli tests-migrate --app zimbra --testType integration --framework jest

# Preview changes without applying them (without affecting files)
yarn manager-cli tests-migrate --app zimbra --testType unit --dry-run`
  },
  'migrations-status': {
    script: 'migrations-status',
    isAppRequired: false,
    description: 'Check status of all migrations across all apps',
    help: `
# Check all migrations
yarn manager-cli migrations-status

# Filter by type (routes or tests)
yarn manager-cli migrations-status --type routes
yarn manager-cli migrations-status --type tests`
  }
};

const validMigrationTypes = ['routes', 'tests'];
const validTestTypes = ['unit', 'integration'];

const printHelp = () => {
  const commandsList = Object.entries(knownCommands)
    .map(([cmd, meta]) => `  ${cmd.padEnd(20)} ${meta.description}`)
    .join('\n');

  const commandsHelp = Object.values(knownCommands)
    .map((meta) => meta.help)
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

// Handle --help or --list
if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}
if (args.includes('--list')) {
  const apps = getAvailableApps();
  if (apps.length === 0) {
    console.log('⚠️  No apps found in packages/manager/apps');
  } else {
    console.log('\n📦 Available apps:');
    apps.forEach((app) => console.log(`  - ${app}`));
    console.log();
  }
  process.exit(0);
}

// Validate command
if (!command) {
  console.error('❌ No command provided.\n');
  printHelp();
  process.exit(1);
}

const knownCommand = knownCommands[command];
if (!knownCommand) {
  console.error(`❌ Unknown command: "${command}"\n`);
  printHelp();
  process.exit(1);
}

// App validation if needed
const appArgIndex = restArgs.findIndex((arg) => arg === '--app');
const appName = appArgIndex !== -1 ? restArgs[appArgIndex + 1] : null;

if (knownCommand.isAppRequired) {
  if (!appName || appName.startsWith('--')) {
    console.error('❌ Missing or invalid --app <app-name> argument.\n');
    printHelp();
    process.exit(1);
  }

  const availableApps = getAvailableApps();
  if (!availableApps.includes(appName)) {
    console.error([
      `❌ App "${appName}" not found in:`,
      `   ${applicationsBasePath}`,
      '',
      `📦 Available apps:`,
      ...availableApps.map((a) => `  - ${a}`),
      '',
      `💡 Tip: Use "yarn manager-cli --list" to see all app names`,
    ].join('\n'));
    process.exit(1);
  }
}

// Extract flags
const extraFlags = [];

const frameworkArgIndex = restArgs.findIndex((arg) => arg === '--framework');
if (frameworkArgIndex !== -1 && restArgs[frameworkArgIndex + 1]) {
  extraFlags.push('--framework', restArgs[frameworkArgIndex + 1]);
}

const hasDryRun = restArgs.includes('--dry-run');
if (hasDryRun) extraFlags.push('--dry-run');

const typeArgIndex = restArgs.findIndex((arg) => arg === '--testType');
const testType = typeArgIndex !== -1 ? restArgs[typeArgIndex + 1] : null;

if (command === 'tests-migrate') {
  if (!testType || testType.startsWith('--')) {
    console.error(`❌ Missing required flag: --testType <unit|integration>`);
    process.exit(1);
  }
  if (!validTestTypes.includes(testType)) {
    console.error(`❌ Invalid --testType "${testType}". Must be one of: ${validTestTypes.join(', ')}`);
    process.exit(1);
  }
  extraFlags.push('--testType', testType);
}

if (command === 'migrations-status') {
  const typeArgIndex = restArgs.findIndex((arg) => arg === '--type');
  const typeValue = typeArgIndex !== -1 ? restArgs[typeArgIndex + 1] : null;
  if (typeArgIndex !== -1) {
    if (!typeValue || typeValue.startsWith('--')) {
      console.error(`❌ Missing value for "--type" flag. Valid values: routes, tests`);
      process.exit(1);
    }
    if (!validMigrationTypes.includes(typeValue)) {
      console.error(`❌ Invalid --type "${typeValue}". Must be one of: ${validMigrationTypes.join(', ')}`);
      process.exit(1);
    }
    extraFlags.push('--type', typeValue);
  }
}

// Final command assembly
const runCommand = [
  'yarn run',
  knownCommand.script,
  knownCommand.isAppRequired ? appName : '',
  ...extraFlags,
].filter(Boolean).join(' ');

try {
  console.log(`\n▶ Running "${command}"${appName ? ` for app: "${appName}"` : ''}`);
  console.log(`⏩ Executing: ${runCommand}\n`);
  execSync(runCommand, { stdio: 'inherit' });
} catch (error) {
  console.error(`\n❌ Execution failed for "${command}"${appName ? ` on "${appName}"` : ''}.`);
  console.error(error);
  process.exit(1);
}
