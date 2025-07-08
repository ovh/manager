#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { createTempBackup, restoreFromTempBackup } from './utils/temp-package-backup-utils.mjs';
import { registerCleanupOnSignals } from './utils/cleanup-utils.mjs';

// Proper __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Custom logic before build
function beforeBuild() {
  console.log('🔧 Preparing before Turbo build...');
  createTempBackup();
}

// ---- Custom logic after build or on exit
function afterBuild() {
  console.log('🧼 Cleaning up: restoring package.json...');
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
