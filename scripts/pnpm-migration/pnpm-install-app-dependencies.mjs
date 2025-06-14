#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import path from 'path';

const pnpmPath = path.resolve('./target/pnpm/pnpm');
const depsPath = path.resolve('./target/pnpm-dependencies.json');
const excludeAppsPath = path.resolve('./scripts/pnpm-migration/exclude-yarn-apps.json');

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
    if (meta?.isInternal && meta.path) {
      const relativePath = path.relative(appPath, path.resolve(meta.path));
      overrides[depName] = `link:${relativePath}`;
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
    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        console.log(`🧹 Removed temporary ${filePath}`);
      }
    } catch (err) {
      console.warn(`⚠️ Failed to remove ${filePath}:`, err.message);
    }
  }
}

// Handle signals to clean up on interrupt
process.on('SIGINT', () => {
  console.log('\n🛑 Caught SIGINT (Ctrl+C). Cleaning up...');
  cleanupAllWorkspaceFiles();
  process.exit(1);
});
process.on('SIGTERM', () => {
  console.log('\n🛑 Caught SIGTERM. Cleaning up...');
  cleanupAllWorkspaceFiles();
  process.exit(1);
});

function installPnpmApps() {
  console.log('📦 Installing PNPM-managed apps with temporary workspace overrides...');

  const excludeApps = loadJson(excludeAppsPath);
  const { all: allDeps } = loadJson(depsPath);

  for (const app of excludeApps) {
    const fullPath = path.resolve(app);
    console.log(`\n➡️ Setting up PNPM workspace in: ${app}`);

    const workspaceFile = createWorkspaceYaml(fullPath, allDeps);

    try {
      console.log(`📥 Installing dependencies in ${app}`);
      execSync(`${pnpmPath} install --lockfile=false --ignore-scripts`, {
        cwd: fullPath,
        stdio: 'inherit',
      });
    } catch (err) {
      console.error(`❌ Failed to install dependencies for ${app}:\n`, err.message);
      cleanupAllWorkspaceFiles();
      process.exit(1);
    }

    // Clean up after success
    cleanupAllWorkspaceFiles();
  }

  console.log('\n✅ All PNPM-managed apps installed successfully.');
}

installPnpmApps();
