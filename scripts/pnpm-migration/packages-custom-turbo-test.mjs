#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { createTempBackup, restoreFromTempBackup } from './utils/temp-package-backup-utils.mjs';
import { registerCleanupOnSignals } from './utils/cleanup-utils.mjs';

// Proper __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Custom logic before test
function beforeTest() {
  console.log('🧪 Preparing before Turbo test...');
  createTempBackup();
}

// ---- Custom logic after test or on exit
function afterTest() {
  console.log('🧼 Cleaning up: restoring package.json...');
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
