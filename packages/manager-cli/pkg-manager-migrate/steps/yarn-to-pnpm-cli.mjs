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
const excludeYarnAppsPath = path.join(repoRoot, 'scripts/pnpm-migration/settings/exclude-yarn-apps.json');
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

// Step 1: Remove from root package.json
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

// Step 2: Append to exclude-yarn-apps.json
async function updateExcludeYarnApps() {
  const data = await readJson(excludeYarnAppsPath);
  const apps = new Set(data);

  if (!apps.has(appPath)) {
    apps.add(appPath);
    if (!isDryRun) {
      await writeJson(excludeYarnAppsPath, Array.from(apps).sort());
    }
    logChange('Updated exclude-yarn-apps.json', `➕ Added "${appPath}"`);
  } else {
    console.log(`✅ "${appPath}" already present in exclude-yarn-apps.json.`);
  }
}

// Step 3: Remove from backup
async function updateYarnBackupPackage() {
  const backup = await readJson(yarnBackupPath);

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

// Entry point
async function migrateAppToPnpm(appName) {
  console.log(`\n🚀 Migrating "${appPath}" from Yarn to PNPM...`);
  await updateRootPackageJson();
  await updateExcludeYarnApps();
  await updateYarnBackupPackage();
  console.log('\n✅ Migration logic completed.\n');
}

// Run
if (!appName) {
  console.error('❌ Please provide an application name. Example: `yarn-to-pnpm-cli.mjs zimbra`');
  process.exit(1);
}

migrateAppToPnpm(appName).catch((err) => {
  console.error('❌ Migration script failed:', err);
  process.exit(1);
});
