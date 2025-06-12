#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

const pnpmPath = path.resolve('./target/pnpm/pnpm');
const excludeAppsPath = path.resolve('./scripts/pnpm-migration/exclude-yarn-apps.json');

function installPnpmApps() {
  console.log('📦 Installing PNPM-managed apps (postinstall)...');

  let excludeApps;
  try {
    excludeApps = JSON.parse(readFileSync(excludeAppsPath, 'utf-8'));
  } catch (err) {
    console.error(`❌ Failed to read or parse ${excludeAppsPath}:`, err.message);
    process.exit(1);
  }

  for (const app of excludeApps) {
    const fullPath = path.resolve(app);
    console.log(`➡️ Running PNPM install in ${fullPath}`);
    try {
      execSync(`${pnpmPath} install --lockfile=false`, { cwd: fullPath, stdio: 'inherit' });
    } catch (err) {
      console.error(`❌ Failed to install PNPM app at ${app}:\n`, err.message);
      process.exit(1);
    }
  }

  console.log('✅ All PNPM-managed apps installed successfully.');
}

installPnpmApps();
