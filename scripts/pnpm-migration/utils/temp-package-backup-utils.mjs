import { existsSync, copyFileSync, unlinkSync } from 'fs';
import path from 'path';

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const tempBackupPath = path.resolve(process.cwd(), 'package.temp.backup.json');

export function createTempBackup() {
  if (existsSync(packageJsonPath)) {
    copyFileSync(packageJsonPath, tempBackupPath);
    console.log(`📦 Created temporary backup: package.json → ${path.basename(tempBackupPath)}`);
  } else {
    throw new Error('❌ Cannot create backup: package.json does not exist');
  }
}

export function restoreFromTempBackup() {
  if (existsSync(tempBackupPath)) {
    copyFileSync(tempBackupPath, packageJsonPath);
    unlinkSync(tempBackupPath);
    console.log(`🔁 Restored package.json from temp backup and cleaned up.`);
  } else {
    console.warn('⚠️ Temp backup not found. Skipping restore.');
  }
}
