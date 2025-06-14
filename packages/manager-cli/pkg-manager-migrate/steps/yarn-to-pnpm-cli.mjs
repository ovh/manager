#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const repoRoot = path.resolve(__dirname, '../../../..');
console.log('📁 Using repoRoot:', repoRoot);

const appRelativePath = (appName) => `packages/manager/apps/${appName}`;
const packageJsonPath = path.join(repoRoot, 'package.json');
const migrationDataPath = path.join(repoRoot, 'scripts/pnpm-migration/packages-apps-migration-data.json');
const yarnBackupPath = path.join(repoRoot, 'scripts/pnpm-migration/package-yarn-backup.json');

// Input
const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');
const appPath = appRelativePath(appName);

// Helpers
async function readJson(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

async function writeJson(filePath, data) {
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, json + '\n', 'utf-8');
}

function logChange(label, details) {
  console.log(`\n🔹 ${label}`);
  console.log(details);
}

async function updateRootPackageJson() {
  const pkg = await readJson(packageJsonPath);
  const oldPackages = pkg.workspaces?.packages || [];

  if (!oldPackages.includes(appPath)) {
    console.log(`✅ App "${appPath}" already removed from root workspaces.`);
    return;
  }

  const newPackages = oldPackages.filter((entry) => entry !== appPath);

  if (!isDryRun) {
    pkg.workspaces.packages = newPackages;
    await writeJson(packageJsonPath, pkg);
  }

  logChange('Updated root package.json', `❌ Removed workspace: "${appPath}"`);
}

async function updateMigrationData() {
  const data = await readJson(migrationDataPath);
  const field = 'exclude-yarn-apps';
  const apps = new Set(data[field] || []);

  if (!apps.has(appPath)) {
    apps.add(appPath);
    if (!isDryRun) {
      data[field] = Array.from(apps).sort();
      await writeJson(migrationDataPath, data);
    }
    logChange('Updated packages-apps-migration-data.json', `➕ Added "${appPath}" to ${field}`);
  } else {
    console.log(`✅ "${appPath}" already present in migration config.`);
  }
}

async function updateYarnBackupPackage() {
  const backup = await readJson(yarnBackupPath);

  // Ensure structure exists
  if (!backup.workspaces) backup.workspaces = {};
  if (!Array.isArray(backup.workspaces.packages)) backup.workspaces.packages = [];

  const oldPackages = backup.workspaces.packages;

  if (!oldPackages.includes(appPath)) {
    console.log(`✅ "${appPath}" already removed from yarn backup.`);
    return;
  }

  const newPackages = oldPackages.filter((entry) => entry !== appPath);

  if (!isDryRun) {
    backup.workspaces.packages = newPackages;
    await writeJson(yarnBackupPath, backup);
  }

  logChange('Updated package-yarn-backup.json', `❌ Removed workspace: "${appPath}"`);
}

async function migrateAppToPnpm(appName) {
  console.log(`\n🚀 Migrating "${appPath}" from Yarn to PNPM...`);
  await updateRootPackageJson();
  await updateMigrationData();
  await updateYarnBackupPackage();
  console.log('\n✅ Migration logic completed.\n');
}

// Entry
if (!appName) {
  console.error('❌ Please provide an application name. Example: `yarn-to-pnpm-cli.mjs zimbra`');
  process.exit(1);
}

migrateAppToPnpm(appName).catch((err) => {
  console.error('❌ Migration script failed:', err);
  process.exit(1);
});
