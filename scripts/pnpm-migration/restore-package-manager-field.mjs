import fs from 'fs';

const path = './package.json';
const backupPath = './.packageManagerBackup.json';

if (!fs.existsSync(backupPath)) {
  console.log('ℹ️ No backup found, skipping restore.');
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(path, 'utf-8'));
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

if (!pkg.packageManager && backup.packageManager) {
  pkg.packageManager = backup.packageManager;
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
  console.log('♻️ Restored packageManager field after install');
} else {
  console.log('⚠️ packageManager already present; skipping restore.');
}

fs.unlinkSync(backupPath); // clean up
