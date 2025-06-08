#!/usr/bin/env node
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const migrationDataPath = path.resolve(__dirname, 'packages-apps-migration-data.json');

function fileExists(p) {
  try {
    return existsSync(p);
  } catch {
    return false;
  }
}

async function getMigrationData() {
  try {
    if (!fileExists(migrationDataPath)) {
      console.warn(`⚠️ Migration config not found at ${migrationDataPath}`);
      return { excludeYarnApps: [], pnpmLinkModules: {} };
    }

    const raw = await fs.readFile(migrationDataPath, 'utf-8');
    const data = JSON.parse(raw);

    return {
      excludeYarnApps: Array.isArray(data['exclude-yarn-apps']) ? data['exclude-yarn-apps'] : [],
      pnpmLinkModules:
        typeof data['pnpm-link-modules'] === 'object' && data['pnpm-link-modules'] !== null
          ? data['pnpm-link-modules']
          : {}
    };
  } catch (err) {
    console.error('❌ Failed to read or parse migration data:', err.message);
    return { excludeYarnApps: [], pnpmLinkModules: {} };
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: 'inherit', ...options });
    proc.on('exit', code =>
      code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} failed`))
    );
  });
}

// Install PNPM dependencies per app (AFTER linking)
async function installPnpmApps(apps) {
  for (const appPath of apps) {
    const fullPath = path.resolve(repoRoot, appPath);
    if (!fileExists(fullPath)) {
      console.warn(`⚠️ App directory not found: ${appPath}`);
      continue;
    }
    console.log(`📁 Running pnpm install in ${appPath}`);
    await run('pnpm', ['install'], { cwd: fullPath });
  }
}

// Link modules globally and into each app
function linkModules(modules, targetApps) {
  for (const [moduleName, modulePath] of Object.entries(modules)) {
    const absoluteModulePath = path.resolve(modulePath);
    if (!fileExists(absoluteModulePath)) {
      console.error(`❌ Module not found: ${moduleName} at ${absoluteModulePath}`);
      continue;
    }

    console.log(`🔗 Linking globally: ${moduleName}`);
    try {
      execSync('pnpm link --global', { cwd: absoluteModulePath, stdio: 'inherit' });
    } catch (err) {
      console.error(`❌ Failed to globally link ${moduleName}: ${err.message}`);
      continue;
    }

    for (const appPath of targetApps) {
      const appDir = path.resolve(repoRoot, appPath);
      if (!fileExists(appDir)) {
        console.warn(`⚠️ App not found for linking: ${appPath}`);
        continue;
      }

      console.log(`🔗 Linking ${moduleName} into ${appPath}`);
      try {
        execSync(`pnpm link ${moduleName}`, { cwd: appDir, stdio: 'inherit' });
      } catch (err) {
        console.error(`❌ Failed to link ${moduleName} in ${appPath}: ${err.message}`);
      }
    }
  }
}

// Main flow
async function main() {
  console.log('🚀 Running postinstall script...');
  const { excludeYarnApps, pnpmLinkModules } = await getMigrationData();

  console.log('📦 Apps to install via PNPM:', excludeYarnApps);
  console.log('📦 Modules to link:', Object.keys(pnpmLinkModules));

  // ✅ Link before install to avoid registry fetch errors
  linkModules(pnpmLinkModules, excludeYarnApps);
  await installPnpmApps(excludeYarnApps);

  console.log('✅ Postinstall steps completed.');
}

main().catch(err => {
  console.error('❌ Postinstall error:', err.message);
  process.exit(1);
});
