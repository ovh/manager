#!/usr/bin/env node

import { runMigration } from '../utils/ScriptUtils.mjs';

const args = process.argv.slice(2);
console.log({args})
// Extract app name (first positional argument)
const appName = args[0];

// Validate app name
if (!appName || appName.startsWith('--')) {
  console.error('❌ Missing or invalid application name. Usage: pkg-manager-migrate <appName> --type <pnpm>');
  process.exit(1);
}

// Extract --type <pnpm>
const typeIndex = args.findIndex((arg) => arg === '--type');
const type = typeIndex !== -1 &&
args[typeIndex + 1] &&
!args[typeIndex + 1].startsWith('--')
  ? args[typeIndex + 1]
  : null;

if (!type) {
  console.error('❌ Missing required flag: --type <pnpm>');
  process.exit(1);
}

// Optional --dry-run
const isDryRun = args.includes('--dry-run');

// Define step scripts for package manager types
const pkgManagerSteps = {
  pnpm: ['node ./pkg-manager-migrate/steps/yarn-to-pnpm-cli.mjs'],
  // other managers can be added later, e.g.:
  // bun: ['node ./pkg-manager-migrate/steps/yarn-to-bun-cli.mjs']
};

if (!pkgManagerSteps[type]) {
  console.error(`❌ Unsupported package manager type "${type}". Supported: ${Object.keys(pkgManagerSteps).join(', ')}`);
  process.exit(1);
}

// Run migration
runMigration({
  appName,
  commandLabel: 'pkg-manager-migrate',
  scriptOrSteps: pkgManagerSteps[type],
  formatGlob: '*.tsx',
  dryRun: isDryRun,
  docLink: '/development-guidelines/pnpm-migration/',
});
