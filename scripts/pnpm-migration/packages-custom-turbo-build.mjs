#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  createTempBackup,
  restoreFromTempBackup,
} from './utils/temp-package-backup-utils.mjs';
import { registerCleanupOnSignals } from './utils/cleanup-utils.mjs';

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../');
const packageJsonPath = path.resolve(repoRoot, 'package.json');
const packageOriginalBackupPath = path.resolve('scripts/pnpm-migration/settings/package-original-backup.json');

// ---- Custom logic before build
function beforeBuild() {
  console.log('🔧 Preparing before Turbo build...');
  createTempBackup();

  if (fs.existsSync(packageOriginalBackupPath)) {
    fs.copyFileSync(packageOriginalBackupPath, packageJsonPath);
    console.log(`📦 Injected content from package-original-backup.json → package.json`);
  } else {
    console.warn('⚠️ package-original-backup.json not found. Skipping injection.');
  }
}

// ---- Custom logic after build or on exit
function afterBuild() {
  console.log('🧼 Cleaning up: restoring original package.json...');
  restoreFromTempBackup();
}

// ---- Main wrapper
function packagesCustomTurboBuild() {
  beforeBuild();
  registerCleanupOnSignals(afterBuild);

  try {
    console.log('🚀 Running turbo run build...');
    execSync('turbo run build --concurrency=5', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Turbo build failed:', err.message);
  } finally {
    afterBuild();
  }
}

packagesCustomTurboBuild();
