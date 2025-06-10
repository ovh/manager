#!/usr/bin/env node
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { spawn, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationDataPath = path.resolve(__dirname, 'packages-apps-migration-data.json');

const repoRoot = path.resolve(__dirname, '..', '..');
const localPnpm = path.resolve(repoRoot, 'target/pnpm/pnpm');
const pnpmStorePath = path.resolve(repoRoot, 'target/.pnpm-store');
const pnpmHome = path.resolve(repoRoot, 'target/pnpm');

const sharedDependencies = {
  react: '^18.2.0',
  'react-dom': '18.2.0',
  'react-hook-form': '^7.55.0',
  'react-i18next': '^14.0.5',
  'react-router-dom': '^6.3.0',
  'react-use': '^17.5.0',
  tailwindcss: '^3.4.4',
  zod: '^3.24.2',
  vite: '^6.0.7'
};

const globalEnv = {
  ...process.env,
  PNPM_HOME: pnpmHome,
  PNPM_STORE_PATH: pnpmStorePath,
  PATH: `${pnpmHome}:${process.env.PATH}`
};

function checkPnpmBinary() {
  if (!existsSync(localPnpm)) {
    console.error(`❌ Local PNPM binary not found at ${localPnpm}`);
    process.exit(1);
  }
}

function runPnpm(args, options = {}) {
  const finalArgs = ['--store-dir', pnpmStorePath, ...args];

  return new Promise((resolve, reject) => {
    const proc = spawn(localPnpm, finalArgs, {
      stdio: 'inherit',
      env: {
        ...globalEnv,
        ...(options.env || {})
      },
      ...options
    });
    proc.on('exit', code =>
      code === 0 ? resolve() : reject(new Error(`pnpm ${args.join(' ')} failed`))
    );
  });
}

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
      console.warn(`⚠️ Migration config not found: ${migrationDataPath}`);
      return { excludeYarnApps: [], pnpmLinkDependencies: {}, pnpmLinkDevDependencies: {} };
    }
    const raw = await fs.readFile(migrationDataPath, 'utf-8');
    const data = JSON.parse(raw);
    return {
      excludeYarnApps: Array.isArray(data['exclude-yarn-apps']) ? data['exclude-yarn-apps'] : [],
      pnpmLinkDependencies:
        typeof data['pnpm-link-dependencies'] === 'object' && data['pnpm-link-dependencies'] !== null
          ? data['pnpm-link-dependencies']
          : {},
      pnpmLinkDevDependencies:
        typeof data['pnpm-link-devDependencies'] === 'object' && data['pnpm-link-devDependencies'] !== null
          ? data['pnpm-link-devDependencies']
          : {}
    };
  } catch (err) {
    console.error('❌ Failed to read or parse migration data:', err.message);
    return { excludeYarnApps: [], pnpmLinkDependencies: {}, pnpmLinkDevDependencies: {} };
  }
}

async function installGlobalDeps() {
  const args = ['add', '--global'];
  for (const [pkg, version] of Object.entries(sharedDependencies)) {
    args.push(`${pkg}@${version}`);
  }
  console.log('📦 Installing shared global dependencies via local PNPM...');
  await runPnpm(args);
}

async function installApps(apps) {
  for (const app of apps) {
    const fullPath = path.resolve(repoRoot, app);
    if (!fileExists(fullPath)) {
      console.warn(`⚠️ App not found: ${app}`);
      continue;
    }
    console.log(`📁 Installing deps in: ${app}`);
    await runPnpm(['install'], { cwd: fullPath });
  }
}

async function linkModulesToApps(depModules, devDepModules, apps) {
  for (const appPath of apps) {
    const appDir = path.resolve(repoRoot, appPath);
    const pkgJsonPath = path.join(appDir, 'package.json');

    if (!fileExists(pkgJsonPath)) {
      console.warn(`⚠️ package.json not found in: ${appPath}`);
      continue;
    }

    const raw = await fs.readFile(pkgJsonPath, 'utf-8');
    const pkgJson = JSON.parse(raw);

    pkgJson.dependencies = pkgJson.dependencies || {};
    pkgJson.devDependencies = pkgJson.devDependencies || {};

    // Remove old entries before linking
    for (const moduleName of Object.keys(depModules)) {
      if (pkgJson.dependencies[moduleName]) {
        console.log(`🧹 [dep] Removing old ${moduleName} from dependencies`);
        delete pkgJson.dependencies[moduleName];
      }
      if (pkgJson.devDependencies[moduleName]) {
        console.log(`🧹 [dep] Removing old ${moduleName} from devDependencies`);
        delete pkgJson.devDependencies[moduleName];
      }

      const relPath = path.relative(appDir, path.resolve(repoRoot, depModules[moduleName]));
      pkgJson.dependencies[moduleName] = `file:${relPath}`;
      console.log(`🔗 [dep] Linked ${moduleName} → file:${relPath}`);
    }

    for (const moduleName of Object.keys(devDepModules)) {
      if (pkgJson.dependencies[moduleName]) {
        console.log(`🧹 [devDep] Removing old ${moduleName} from dependencies`);
        delete pkgJson.dependencies[moduleName];
      }
      if (pkgJson.devDependencies[moduleName]) {
        console.log(`🧹 [devDep] Removing old ${moduleName} from devDependencies`);
        delete pkgJson.devDependencies[moduleName];
      }

      const relPath = path.relative(appDir, path.resolve(repoRoot, devDepModules[moduleName]));
      pkgJson.devDependencies[moduleName] = `file:${relPath}`;
      console.log(`🔗 [devDep] Linked ${moduleName} → file:${relPath}`);
    }

    await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
  }
}

async function buildSharedModulesTurbo(paths) {
  const filters = Object.keys(paths).map(p => `--filter=${p}`);
  if (filters.length === 0) return;

  const args = ['turbo', 'run', 'build', ...filters];
  console.log(`🔨 Building shared modules: yarn ${args.join(' ')}`);

  const result = spawnSync('yarn', args, {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env // Use native env as Yarn is global here
  });

  if (result.status !== 0) {
    throw new Error(`❌ turbo build failed with exit code ${result.status}`);
  }
}

async function main() {
  console.log('🚀 Running postinstall with local PNPM and isolated store...');
  checkPnpmBinary();

  const { excludeYarnApps, pnpmLinkDependencies, pnpmLinkDevDependencies } = await getMigrationData();

  console.log('📦 PNPM apps:', excludeYarnApps);
  console.log('📦 PNPM dependencies:', Object.keys(pnpmLinkDependencies));
  console.log('📦 PNPM devDependencies:', Object.keys(pnpmLinkDevDependencies));

  await installGlobalDeps();

  await buildSharedModulesTurbo({ ...pnpmLinkDependencies, ...pnpmLinkDevDependencies });

  await linkModulesToApps(pnpmLinkDependencies, pnpmLinkDevDependencies, excludeYarnApps);
  await installApps(excludeYarnApps);

  console.log('✅ All postinstall tasks done using local PNPM and isolated store');
}

main().catch(err => {
  console.error('❌ Postinstall error:', err.message);
  process.exit(1);
});
