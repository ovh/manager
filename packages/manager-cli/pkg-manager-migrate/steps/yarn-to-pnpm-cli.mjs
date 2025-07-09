#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const repoRoot = path.resolve(__dirname, '../../../..');
console.log('📁 Using repoRoot:', repoRoot);

const appRelativePath = (appName) => `packages/manager/apps/${appName}`;
const packageJsonPath = path.join(repoRoot, 'package.json');
const excludeYarnAppsPath = path.join(repoRoot, 'scripts/pnpm-migration/settings/exclude-yarn-apps.json');

// Input
const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');
const appPath = appRelativePath(appName);
const appFullPath = path.join(repoRoot, appPath);

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

async function confirmAction(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} [y/N]: `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

// Step 0: Sanity check
async function validateAppPath() {
  try {
    await fs.access(appFullPath);
  } catch {
    throw new Error(`❌ App path does not exist: ${appPath}`);
  }
}

// Step 1: Remove from root package.json
async function updateRootPackageJson() {
  const pkg = await readJson(packageJsonPath);

  if (!pkg.workspaces?.packages || !Array.isArray(pkg.workspaces.packages)) {
    throw new Error('❌ Invalid or missing "workspaces.packages" in package.json');
  }

  const oldPackages = pkg.workspaces.packages;

  if (!oldPackages.includes(appPath)) {
    console.log(`✅ App "${appPath}" already removed from root workspaces.`);
    return;
  }

  const newPackages = oldPackages.filter((entry) => entry !== appPath);

  if (!isDryRun) {
    const confirmed = await confirmAction(
      `Are you sure you want to remove "${appPath}" from root workspaces?`
    );
    if (!confirmed) {
      console.log('❌ Aborting as per user input.');
      process.exit(1);
    }
    pkg.workspaces.packages = newPackages;
    await writeJson(packageJsonPath, pkg);
  }

  logChange('Updated root package.json', `❌ Removed workspace: "${appPath}"`);
}

// Step 2: Append to exclude-yarn-apps.json
async function updateExcludeYarnApps() {
  const data = await readJson(excludeYarnAppsPath);
  if (!Array.isArray(data)) {
    throw new Error(`❌ File ${excludeYarnAppsPath} does not contain a valid array`);
  }

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

// Entry point
async function migrateAppToPnpm(appName) {
  console.log(`\n🚀 Migrating "${appPath}" from Yarn to PNPM...`);

  try {
    await validateAppPath();
    await updateRootPackageJson();
    await updateExcludeYarnApps();
    console.log('\n✅ Migration logic completed.\n');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

// Run
if (!appName) {
  console.error('❌ Please provide an application name. Example: `yarn-to-pnpm-cli.mjs zimbra`');
  process.exit(1);
}

migrateAppToPnpm(appName);
