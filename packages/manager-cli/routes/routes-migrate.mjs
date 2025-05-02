#!/usr/bin/env node

import { execSync } from 'child_process';

const appName = process.argv[2];

const isValidAppName = /^[a-zA-Z0-9_-]+$/.test(appName);

if (!appName || !isValidAppName) {
  console.error(
    '❌ Error: Missing or invalid app name.\nUsage: yarn routes-update <app-name>\nApp name must match /^[a-zA-Z0-9_-]+$/',
  );
  process.exit(1);
}

try {
  console.log(`Running transform-routes-cli for ${appName}...`);
  execSync(`node ./routes/transform-routes-cli.mjs ${appName}`, { stdio: 'inherit' });

  console.log(`Running update-routers-init-cli for ${appName}...`);
  execSync(`node ./routes/update-routers-init-cli.mjs ${appName}`, { stdio: 'inherit' });

  console.log('Migration completed successfully');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}
