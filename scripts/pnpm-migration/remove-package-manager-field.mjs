#!/usr/bin/env node
import fs from 'fs';
import { registerCleanupOnSignals } from './utils/cleanup-utils.mjs';

const pkgPath = './package.json';
const backupPath = './.packageManagerBackup.json';

let originalPkg = null;

// Safe restore on crash
function restoreIfCrashed() {
  if (originalPkg) {
    fs.writeFileSync(pkgPath, JSON.stringify(originalPkg, null, 2));
    console.log('♻️ package.json restored due to error or signal.');
  }
}

registerCleanupOnSignals(restoreIfCrashed);

try {
  const raw = fs.readFileSync(pkgPath, 'utf-8');
  const pkg = JSON.parse(raw);
  originalPkg = pkg; // snapshot for rollback

  if (!('packageManager' in pkg)) {
    console.log('✅ packageManager field already absent; nothing to do.');
    process.exit(0);
  }

  // Backup the field only
  fs.writeFileSync(backupPath, JSON.stringify({ packageManager: pkg.packageManager }));

  // Delete just the field
  delete pkg.packageManager;

  // Write back without modifying anything else
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('🧹 packageManager field removed for PNPM install');

  originalPkg = null; // success, no need to restore
} catch (err) {
  console.error('❌ Failed to remove packageManager:', err);
  restoreIfCrashed();
  process.exit(1);
}
