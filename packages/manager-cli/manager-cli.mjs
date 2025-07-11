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
  'duplicated-translations': {
    script: 'check-duplicated-translations',
    isAppRequired: true,
    description:
      'Check for duplicate translations that already exist in the common module.',
    help: `
      #Check duplicated translations on zimbra app
      yarn manager-cli duplicated-translations --app zimbra
    `,
  },
  'pkg-manager-migrate': {
    script: 'pkg-manager-migrate',
    isAppRequired: true,
    description: 'Migrate a specific app to a new package manager (e.g., pnpm)',
    help: `
# Migrate an app from Yarn to PNPM
yarn manager-cli pkg-manager-migrate --app zimbra --type pnpm

# Dry-run preview
yarn manager-cli pkg-manager-migrate --app zimbra --type pnpm --dry-run`,
  },
  'migrations-status': {
    script: 'migrations-status',
    isAppRequired: false,
    description: 'Check status of all migrations across all apps',
    help: `
# Check all migrations
yarn manager-cli migrations-status --type all

# Filter by type (routes, tests or swc)
yarn manager-cli migrations-status --type routes
yarn manager-cli migrations-status --type tests
yarn manager-cli migrations-status --type swc

# Export as HTML or JSON
yarn manager-cli migrations-status --type routes --format json
yarn manager-cli migrations-status --type tests --format html

yarn manager-cli migrations-status --type all --format html
yarn manager-cli migrations-status --type all --format json`
  },
};

const validMigrationTypes = ['routes', 'tests', 'swc', 'all'];
const validTestTypes = ['unit', 'integration'];
const validPkgManagerTypes = ['pnpm'];
const validFormats = ['json', 'html'];

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
  yarn manager-cli <command> [--app <app-name>] [--testType <unit|integration>] [--framework <name>] [--dry-run] [--type <routes|tests|swc>] [--format <json|html>]

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

const typeArgIndex = restArgs.findIndex((arg) => arg === '--type');
const typeValue = typeArgIndex !== -1 ? restArgs[typeArgIndex + 1] : null;

if (command === 'migrations-status') {
  if (typeArgIndex !== -1) {
    if (!typeValue || typeValue.startsWith('--')) {
      console.error(`❌ Missing value for "--type" flag. Valid values: ${validMigrationTypes.join(', ')}`);
      process.exit(1);
    }
    if (!validMigrationTypes.includes(typeValue)) {
      console.error(`❌ Invalid --type "${typeValue}". Must be one of: ${validMigrationTypes.join(', ')}`);
      process.exit(1);
    }
    extraFlags.push('--type', typeValue);
  }

  const formatArgIndex = restArgs.findIndex((arg) => arg === '--format');
  const formatValue = formatArgIndex !== -1 ? restArgs[formatArgIndex + 1] : null;

  if (formatArgIndex !== -1) {
    if (!formatValue || formatValue.startsWith('--')) {
      console.error(`❌ Missing value for "--format" flag. Valid values: ${validFormats.join(', ')}`);
      process.exit(1);
    }
    if (!validFormats.includes(formatValue)) {
      console.error(`❌ Invalid --format "${formatValue}". Must be one of: ${validFormats.join(', ')}`);
      process.exit(1);
    }
    extraFlags.push('--format', formatValue);
  }
}

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

// Handle package manager migration
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
