import fs from 'fs';

const pkgPath = './package.json';
const backupPath = './.packageManagerBackup.json';

let originalPkg = null;

// Register cleanup on exit
function restoreIfCrashed() {
  if (originalPkg) {
    fs.writeFileSync(pkgPath, JSON.stringify(originalPkg, null, 2));
    console.log('♻️ package.json restored due to error or signal.');
  }
}

process.on('SIGINT', restoreIfCrashed);
process.on('SIGTERM', restoreIfCrashed);
process.on('uncaughtException', (err) => {
  console.error('🔥 uncaughtException:', err);
  restoreIfCrashed();
  process.exit(1);
});

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

  // Clear rollback snapshot — safe to exit
  originalPkg = null;
} catch (err) {
  console.error('❌ Failed to remove packageManager:', err);
  restoreIfCrashed();
  process.exit(1);
}
