import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Proper __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const repoRoot = path.resolve(__dirname, '..', '..');
const packageJsonPath = path.join(repoRoot, 'package.json');
const packageOriginalBackupPath = path.join(__dirname, 'package-original-backup.json');
const packageYarnBackupPath = path.join(__dirname, 'package-yarn-backup.json');

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function restorePackage(fromPath, toPath, label) {
  if (fileExists(fromPath)) {
    fs.copyFileSync(fromPath, toPath);
    console.log(`✅ Restored ${label}: ${path.basename(fromPath)} → ${path.basename(toPath)}`);
  } else {
    console.warn(`⚠️ Skipped ${label}: ${path.basename(fromPath)} not found`);
  }
}

// ---- Custom logic before build
function beforeBuild() {
  console.log('🔧 Preparing before Turbo build...');
  restorePackage(packageOriginalBackupPath, packageJsonPath, 'original package.json');
}

// ---- Custom logic after build or on exit
function restoreYarnBackup() {
  console.log('🧼 Cleaning up: restoring yarn-backed package.json...');
  restorePackage(packageYarnBackupPath, packageJsonPath, 'yarn-backed package.json');
}

// ---- Signal handling (e.g., Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n🛑 Caught SIGINT (Ctrl+C)');
  restoreYarnBackup();
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Caught SIGTERM');
  restoreYarnBackup();
  process.exit(1);
});

// ---- Main wrapper
function packagesCustomTurboBuild() {
  beforeBuild();

  try {
    console.log('🚀 Running turbo run build...');
    execSync('turbo run build --concurrency=5', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Turbo build failed:', err.message);
  } finally {
    restoreYarnBackup();
  }
}

packagesCustomTurboBuild();
