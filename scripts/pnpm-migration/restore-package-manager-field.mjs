#!/usr/bin/env node
import fs from 'fs';
import { registerCleanupOnSignals, safeUnlink } from './utils/cleanup-utils.mjs';

const pkgPath = './package.json';
const backupPath = './.packageManagerBackup.json';

function restoreFromBackup() {
  if (!fs.existsSync(backupPath)) {
    console.log('ℹ️ No backup found; skipping restore.');
    return;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    if (pkg.packageManager === backup.packageManager) {
      console.log('✅ packageManager already present with same value; skipping.');
      safeUnlink(backupPath);
      return;
    }

    const updated = { ...pkg, packageManager: backup.packageManager };
    fs.writeFileSync(pkgPath, JSON.stringify(updated, null, 2));
    safeUnlink(backupPath);
    console.log('♻️ Restored packageManager field after install');
  } catch (err) {
    console.error('❌ Failed to restore packageManager:', err);
    process.exit(1);
  }
}

registerCleanupOnSignals(() => {
  // Ensure backup is not leaked if process exits
  safeUnlink(backupPath);
});

restoreFromBackup();
