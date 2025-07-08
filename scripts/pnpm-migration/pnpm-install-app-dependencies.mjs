#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { safeUnlink, registerCleanupOnSignals } from './utils/cleanup-utils.mjs';

// Paths
const ROOT_DIR = path.resolve('.');
const STORE_DIR = path.resolve(ROOT_DIR, 'target/.pnpm-store');
const pnpmPath = path.resolve('./target/pnpm/pnpm');
const pnpmOptions = ` --ignore-scripts --no-lockfile --store-dir=${STORE_DIR}`;
const depsPath = path.resolve('./target/pnpm-dependencies.json');
const excludeAppsPath = path.resolve('./scripts/pnpm-migration/settings/exclude-yarn-apps.json');
const specialOverridesPath = path.resolve('./scripts/pnpm-migration/settings/special-version-overrides.json');

// Load shared override config
const SPECIAL_VERSION_OVERRIDES = JSON.parse(readFileSync(specialOverridesPath, 'utf-8'));

// Track created workspace files for cleanup
const createdWorkspaceFiles = new Set();

function loadJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`❌ Failed to read or parse ${filePath}:`, err.message);
    process.exit(1);
  }
}

function createWorkspaceYaml(appPath, allDeps) {
  const pkgPath = path.join(appPath, 'package.json');
  const pkg = loadJson(pkgPath);

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };

  const overrides = {};

  for (const [depName] of Object.entries(deps)) {
    const meta = allDeps[depName];
    if (meta?.isInternal && meta?.private && meta.path) {
      const relativePath = path.relative(appPath, path.resolve(meta.path));
      overrides[depName] = `link:${relativePath}`;
      console.log(`🔗 Linking private internal: ${depName} → ${relativePath}`);
    } else if (meta?.isInternal && !meta?.private) {
      console.log(`📦 Skipping public internal: ${depName}`);
    }
  }

  for (const [specialDep, version] of Object.entries(SPECIAL_VERSION_OVERRIDES)) {
    if (!overrides[specialDep]) {
      overrides[specialDep] = version;
      console.log(`🔁 Injected special override: ${specialDep} → ${version}`);
    }
  }

  const content = [
    `packages:`,
    `  - .`,
    ``,
    `overrides:`,
    ...Object.entries(overrides).map(([pkg, val]) => `  "${pkg}": "${val}"`),
    ``,
  ].join('\n');

  const workspaceYamlPath = path.join(appPath, 'pnpm-workspace.yaml');
  writeFileSync(workspaceYamlPath, content);
  console.log(`📝 Created temporary ${workspaceYamlPath}`);

  createdWorkspaceFiles.add(workspaceYamlPath);
  return workspaceYamlPath;
}

function cleanupAllWorkspaceFiles() {
  for (const filePath of createdWorkspaceFiles) {
    safeUnlink(filePath);
  }
}

registerCleanupOnSignals(cleanupAllWorkspaceFiles);

function installPnpmApps() {
  console.log('📦 Installing PNPM-managed apps with temporary workspace overrides...');

  const excludeApps = loadJson(excludeAppsPath);
  const { all: allDeps } = loadJson(depsPath);

  for (const app of excludeApps) {
    const fullPath = path.resolve(app);
    console.log(`\n➡️ Setting up PNPM workspace in: ${app}`);

    const workspaceFile = createWorkspaceYaml(fullPath, allDeps);
    console.log(`📝 Temporary workspace file ${workspaceFile}`);

    try {
      console.log(`📥 Installing dependencies in ${app}`);
      execSync(`${pnpmPath} install ${pnpmOptions}`, {
        cwd: fullPath,
        stdio: 'inherit',
      });
    } catch (err) {
      console.error(`❌ Failed to install dependencies for ${app}:\n`, err.message);
      cleanupAllWorkspaceFiles();
      process.exit(1);
    }

    cleanupAllWorkspaceFiles();
  }

  console.log('\n✅ All PNPM-managed apps installed successfully.');
}

installPnpmApps();
