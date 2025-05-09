#!/usr/bin/env node

import { runMigration } from '../utils/ScriptUtils.mjs';

const args = process.argv.slice(2);
const appName = args[0];
const isDryRun = args.includes('--dry-run');

// Extract framework flag (e.g., --framework vitest)
const frameworkIndex = args.findIndex((arg) => arg === '--framework');
const framework =
  frameworkIndex !== -1 && args[frameworkIndex + 1] && !args[frameworkIndex + 1].startsWith('--')
    ? args[frameworkIndex + 1]
    : 'vitest';

runMigration({
  appName,
  commandLabel: 'unit-tests',
  framework,
  dryRun: isDryRun,
});

