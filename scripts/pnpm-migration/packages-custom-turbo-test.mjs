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

// ---- Custom logic before test
function beforeTest() {
  console.log('🔧 Preparing before Turbo test...');
  createTempBackup();

  if (fs.existsSync(packageOriginalBackupPath)) {
    fs.copyFileSync(packageOriginalBackupPath, packageJsonPath);
    console.log(`📦 Injected content from package-original-backup.json → package.json`);
  } else {
    console.warn('⚠️ package-original-backup.json not found. Skipping injection.');
  }
}

// ---- Custom logic after test or on exit
function afterTest() {
  console.log('🧼 Cleaning up: restoring original package.json...');
  restoreFromTempBackup();
}

// ---- Main wrapper
function packagesCustomTurboTest() {
  beforeTest();
  registerCleanupOnSignals(afterTest);

  try {
    console.log('🚀 Running turbo run test...');
    execSync('turbo run test --concurrency=1', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Turbo test failed:', err.message);
  } finally {
    afterTest();
  }
}

packagesCustomTurboTest();
