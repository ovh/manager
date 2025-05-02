#!/usr/bin/env node

import { execSync } from 'child_process';

const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');
const isValidAppName = /^[a-zA-Z0-9_-]+$/.test(appName);

if (!appName || !isValidAppName) {
  console.error(
    '❌ Error: Missing or invalid app name.\nUsage: yarn routes-update <app-name> [--dry-run]\nApp name must match /^[a-zA-Z0-9_-]+$/',
  );
  process.exit(1);
}

try {
  // Build the command with optional dry-run flag
  const transformCommand = `node ./routes/transform-routes-cli.mjs ${appName}${isDryRun ? ' --dry-run' : ''}`;
  const updateCommand = `node ./routes/update-routers-init-cli.mjs ${appName}${isDryRun ? ' --dry-run' : ''}`;

  console.log(`Running transform-routes-cli for ${appName}...`);
  execSync(transformCommand, { stdio: 'inherit' });

  console.log(`Running update-routers-init-cli for ${appName}...`);
  execSync(updateCommand, { stdio: 'inherit' });

  console.log('Migration completed successfully');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}
