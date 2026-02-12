#!/usr/bin/env node
import { runMigration } from '../utils/ScriptUtils.mjs';

// Supported test types for validation
const validTestTypes = ['unit', 'integration'];

// test commands for types
const testCommands = {
  unit: 'test',
  integration: 'test:integration',
};

const args = process.argv.slice(2);

// Extract app name (first positional argument)
const appName = args[0];

// Check for optional flags
const isDryRun = args.includes('--dry-run');

// Extract framework (e.g. --framework vitest)
const frameworkIndex = args.findIndex((arg) => arg === '--framework');
const framework =
  frameworkIndex !== -1 && args[frameworkIndex + 1] && !args[frameworkIndex + 1].startsWith('--')
    ? args[frameworkIndex + 1]
    : 'vitest';

// Extract test type (e.g. --type unit, --type integration)
const typeIndex = args.findIndex((arg) => arg === '--testType');
const testType =
  typeIndex !== -1 && args[typeIndex + 1] && !args[typeIndex + 1].startsWith('--')
    ? args[typeIndex + 1]
    : null;

if (!testType) {
  console.error(`❌ Missing required flag: --testType <unit|integration>`);
  process.exit(1);
}

if (!validTestTypes.includes(testType)) {
  console.error(
    `❌ Invalid --testType "${testType}". Must be one of: ${validTestTypes.join(', ')}`,
  );
  process.exit(1);
}

if (!testCommands[testType]) {
  console.error(`❌ No test command for testType "${testType}".`);
  process.exit(1);
}

runMigration({
  appName,
  commandLabel: 'tests-migrate',
  framework,
  testType,
  testCommand: testCommands[testType],
  dryRun: isDryRun,
  docLink: '/development-guidelines/update-unit-tests/',
});
