#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const pnpmPath = path.resolve('./target/pnpm/pnpm');
const depsPath = path.resolve('./target/pnpm-dependencies.json');
const excludeAppsPath = path.resolve('./scripts/pnpm-migration/exclude-yarn-apps.json');
const REGISTRY = '--registry=https://registry.yarnpkg.com';

function loadJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`❌ Failed to read or parse ${filePath}:`, err.message);
    process.exit(1);
  }
}

function writeLocalWorkspaceYaml(appPath, allDeps) {
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
    `  - .`, // app is its own root
    ``,
    `overrides:`,
    ...Object.entries(overrides).map(([pkg, val]) => `  "${pkg}": "${val}"`),
    ``,
  ].join('\n');

  const workspaceYamlPath = path.join(appPath, 'pnpm-workspace.yaml');
  writeFileSync(workspaceYamlPath, content);
  console.log(`📝 Created ${workspaceYamlPath}`);
}

function installPnpmApps() {
  console.log('📦 Installing PNPM-managed apps with local workspace overrides...');

  const excludeApps = loadJson(excludeAppsPath);
  const { all: allDeps } = loadJson(depsPath);

  for (const app of excludeApps) {
    const fullPath = path.resolve(app);
    console.log(`\n➡️ Setting up PNPM workspace in: ${app}`);

    // Step 1: Write pnpm-workspace.yaml for the app
    writeLocalWorkspaceYaml(fullPath, allDeps);

    // Step 2: Install dependencies using npm registry
    console.log(`📥 Installing dependencies in ${app}`);
    try {
      execSync(`${pnpmPath} install --lockfile=false ${REGISTRY}`, {
        cwd: fullPath,
        stdio: 'inherit',
      });
    } catch (err) {
      console.error(`❌ Failed to install dependencies for ${app}:\n`, err.message);
      process.exit(1);
    }
  }

  console.log('\n✅ All PNPM-managed apps installed successfully.');
}

installPnpmApps();
