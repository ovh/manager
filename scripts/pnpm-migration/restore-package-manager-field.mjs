import fs from 'fs';

const pkgPath = './package.json';
const backupPath = './.packageManagerBackup.json';

try {
  if (!fs.existsSync(backupPath)) {
    console.log('ℹ️ No backup found; skipping restore.');
    process.exit(0);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

  if (pkg.packageManager === backup.packageManager) {
    console.log('✅ packageManager already present with same value; skipping.');
    fs.unlinkSync(backupPath);
    process.exit(0);
  }

  const updated = { ...pkg, packageManager: backup.packageManager };

  fs.writeFileSync(pkgPath, JSON.stringify(updated, null, 2));
  fs.unlinkSync(backupPath);

  console.log('♻️ Restored packageManager field after install');
} catch (err) {
  console.error('❌ Failed to restore packageManager:', err);
  process.exit(1);
}
