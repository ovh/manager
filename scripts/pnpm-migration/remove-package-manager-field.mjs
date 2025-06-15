import fs from 'fs';

const path = './package.json';
const backupPath = './.packageManagerBackup.json';

const pkg = JSON.parse(fs.readFileSync(path, 'utf-8'));

if (pkg.packageManager) {
  fs.writeFileSync(backupPath, JSON.stringify({ packageManager: pkg.packageManager }));
  delete pkg.packageManager;
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
  console.log('🧹 Removed packageManager field for pnpm install');
} else {
  console.log('✅ packageManager field not found; skipping');
}
