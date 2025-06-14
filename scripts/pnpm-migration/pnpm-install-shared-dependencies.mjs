#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';

// CLI args
const args = process.argv.slice(2);
const forceRebuild = args.includes('--rebuild-graph');

// Paths
const ROOT_DIR = path.resolve('.');
const STORE_DIR = path.resolve(ROOT_DIR, 'target/.pnpm-store');
const pnpmPath = path.resolve('./target/pnpm/pnpm');
const pnpmOptions = ` --ignore-scripts --no-lockfile --store-dir=${STORE_DIR}`;
const depsPath = path.resolve('./target/pnpm-dependencies.json');
const specialOverridesPath = path.resolve('./scripts/pnpm-migration/settings/special-version-overrides.json');

// Load version overrides
const SPECIAL_VERSION_OVERRIDES = JSON.parse(readFileSync(specialOverridesPath, 'utf-8'));

const createdWorkspaceFiles = new Set();

function buildPnpmDependenciesGraph() {
  console.log('🧠 Building dependency map using yarn.lock...');
  execSync('node ./scripts/pnpm-migration/pnpm-build-dependencies-graph.mjs', { stdio: 'inherit' });

  if (!existsSync(depsPath)) {
    console.error('❌ Failed to generate pnpm-dependencies.json');
    process.exit(1);
  }
  console.log('✅ Dependency map ready.');
}

function writeTemporaryWorkspaceYaml(appPath, allDeps, packageDeps) {
  const overrides = {};

  for (const depName of Object.keys(packageDeps)) {
    const meta = allDeps[depName];
    if (meta?.isInternal && meta.private && meta.path) {
      const rel = path.relative(appPath, path.resolve(meta.path));
      overrides[depName] = `link:${rel}`;
    }
  }

  for (const [specialDep, version] of Object.entries(SPECIAL_VERSION_OVERRIDES)) {
    if (!overrides[specialDep]) {
      overrides[specialDep] = version;
      console.log(`🔁 Injected special override: ${specialDep} → ${version}`);
    }
  }

  const yamlContent = [
    'packages:',
    '  - .',
    '',
    'overrides:',
    ...Object.entries(overrides).map(([k, v]) => `  "${k}": "${v}"`),
    '',
  ].join('\n');

  const workspacePath = path.join(appPath, 'pnpm-workspace.yaml');
  writeFileSync(workspacePath, yamlContent);
  createdWorkspaceFiles.add(workspacePath);
  console.log(`📝 Temporary pnpm-workspace.yaml written for ${path.basename(appPath)}`);
  return workspacePath;
}

function deleteTemporaryWorkspaceYaml(p) {
  if (existsSync(p)) {
    unlinkSync(p);
    createdWorkspaceFiles.delete(p);
    console.log(`🧹 Deleted temporary workspace file: ${p}`);
  }
}

function cleanupAllWorkspaceFiles() {
  for (const p of createdWorkspaceFiles) deleteTemporaryWorkspaceYaml(p);
}

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

function feedLocalPnpmStore() {
  console.log('📦 Feeding PNPM store with internal packages...');
  const data = JSON.parse(readFileSync(depsPath, 'utf-8'));
  const pkgs = data.orderedInternalPackages || [];

  for (const pkg of pkgs) {
    const meta = data.all[pkg];
    if (!meta?.path) {
      console.warn(`⚠️ Skipping ${pkg} – no path info`);
      continue;
    }

    const fullPath = path.resolve(meta.path);
    const isInternal = Boolean(meta.isInternal ?? false);
    const isPrivate = Boolean(meta.private ?? false);

    if (isInternal) {
      if (!existsSync(fullPath)) {
        console.error(`❌ Invalid path for ${pkg}: ${fullPath}`);
        process.exit(1);
      }

      const pkgJsonPath = path.join(fullPath, 'package.json');
      const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
      const allPackageDeps = {
        ...pkgJson.dependencies,
        ...pkgJson.devDependencies,
        ...pkgJson.peerDependencies,
      };

      if (isPrivate) {
        console.log(`🔗 Linking PRIVATE internal package ${pkg}`);
        const workspacePath = writeTemporaryWorkspaceYaml(fullPath, data.all, allPackageDeps);
        try {
          execSync(`${pnpmPath} install ${pnpmOptions}`, {
            cwd: fullPath,
            stdio: 'inherit',
          });
        } catch (err) {
          console.error(`❌ Failed to install ${pkg}:\n`, err.message);
          cleanupAllWorkspaceFiles();
          process.exit(1);
        }
        deleteTemporaryWorkspaceYaml(workspacePath);
      } else {
        const version = meta?.versions?.[0] || 'latest';
        console.log(`🌐 Fetching PUBLIC internal package ${pkg}@${version}`);
        try {
          execSync(`${pnpmPath} fetch ${pkg}@${version} ${pnpmOptions}`, { stdio: 'inherit' });
        } catch (err) {
          console.error(`❌ Failed to fetch ${pkg}@${version}:`, err.message);
          process.exit(1);
        }
      }
    } else {
      const version = meta?.versions?.[0] || 'latest';
      console.log(`🌍 Fetching EXTERNAL package ${pkg}@${version}`);
      try {
        execSync(`${pnpmPath} fetch ${pkg}@${version} ${pnpmOptions}`, { stdio: 'inherit' });
      } catch (err) {
        const msg = err.message || '';
        if (/403|unauthorized|not found|forbidden/i.test(msg)) {
          console.error(`🔒 Access denied fetching ${pkg}@${version}`);
        } else {
          console.error(`❌ Failed to fetch ${pkg}@${version}:`, msg);
        }
        process.exit(1);
      }
    }
  }

  console.log(`✅ Installed ${pkgs.length} internal packages`);
  console.log('✅ Internal packages installed in correct order.');
}

const hasGraph = existsSync(depsPath);

if (forceRebuild || !hasGraph) {
  console.log(forceRebuild ? '🔄 Rebuilding dependency graph by user request...' : '📋 No dependency graph found — running full setup...');
  buildPnpmDependenciesGraph();
  feedLocalPnpmStore();
} else {
  console.log('⚡ Skipping shared dependency install — graph already present.');
}
