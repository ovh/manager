#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';

// CLI args
const args = process.argv.slice(2);
const forceRebuild = args.includes('--rebuild-graph');

// Paths
const pnpmPath = path.resolve('./target/pnpm/pnpm');
const depsPath = path.resolve('./target/pnpm-dependencies.json');
const requiredTools = [
  'typescript@^5.0.0',
  'typescript@^5.8.2',
  'rollup@^3.29.4',
];

// Track created workspace files for cleanup
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

function installRequiredTooling() {
  if (!Array.isArray(requiredTools) || requiredTools.length === 0) return;

  console.log('🔧 Installing build tooling before running prepare scripts...');
  for (const tool of requiredTools) {
    try {
      execSync(`${pnpmPath} fetch ${tool}`, { stdio: 'inherit' });
      console.log(`✅ Fetched ${tool} into PNPM store`);
    } catch (err) {
      console.error(`❌ Failed to fetch ${tool}:`, err.message);
      process.exit(1);
    }
  }
}

function writeTemporaryWorkspaceYaml(appPath, allDeps, packageDeps) {
  const overrides = {};
  for (const depName of Object.keys(packageDeps)) {
    const meta = allDeps[depName];
    if (meta?.isInternal && meta.path) {
      const relativePath = path.relative(appPath, path.resolve(meta.path));
      overrides[depName] = `link:${relativePath}`;
    }
  }

  const yamlContent = [
    'packages:',
    '  - .',
    '',
    'overrides:',
    ...Object.entries(overrides).map(([pkg, val]) => `  "${pkg}": "${val}"`),
    '',
  ].join('\n');

  const workspacePath = path.join(appPath, 'pnpm-workspace.yaml');
  writeFileSync(workspacePath, yamlContent);
  createdWorkspaceFiles.add(workspacePath);
  console.log(`📝 Temporary pnpm-workspace.yaml written for ${path.basename(appPath)}`);
  return workspacePath;
}

function deleteTemporaryWorkspaceYaml(workspacePath) {
  if (existsSync(workspacePath)) {
    unlinkSync(workspacePath);
    createdWorkspaceFiles.delete(workspacePath);
    console.log(`🧹 Deleted temporary workspace file: ${workspacePath}`);
  }
}

function cleanupAllWorkspaceFiles() {
  for (const path of createdWorkspaceFiles) {
    deleteTemporaryWorkspaceYaml(path);
  }
}

// Handle termination signals
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
      console.warn(`⚠️ Skipping ${pkg} – no path info in metadata.`);
      continue;
    }

    const fullPath = path.resolve(meta.path);
    const isInternal = Boolean(meta.isInternal ?? false);

    if (isInternal) {
      if (!existsSync(fullPath)) {
        console.error(`❌ Internal package ${pkg} has invalid path: ${fullPath}`);
        process.exit(1);
      }

      console.log(`📦 Installing INTERNAL package ${pkg} from ${fullPath}`);

      const pkgJsonPath = path.join(fullPath, 'package.json');
      const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
      const allPackageDeps = {
        ...pkgJson.dependencies,
        ...pkgJson.devDependencies,
        ...pkgJson.peerDependencies,
      };

      const workspacePath = writeTemporaryWorkspaceYaml(fullPath, data.all, allPackageDeps);

      try {
        execSync(`${pnpmPath} install --lockfile=false --ignore-scripts`, {
          cwd: fullPath,
          stdio: 'inherit',
        });
      } catch (err) {
        console.error(`❌ Failed to install ${pkg} at ${fullPath}:\n`, err.message);
        cleanupAllWorkspaceFiles();
        process.exit(1);
      }

      deleteTemporaryWorkspaceYaml(workspacePath);
    } else {
      const version = meta?.version || 'latest';
      console.log(`🌍 Fetching EXTERNAL package ${pkg}@${version} from registry...`);
      try {
        execSync(`${pnpmPath} fetch ${pkg}@${version}`, {
          stdio: 'inherit',
        });
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

// 🔁 Execute logic
const hasGraph = existsSync(depsPath);

if (forceRebuild || !hasGraph) {
  console.log(forceRebuild ? '🔄 Rebuilding dependency graph by user request...' : '📋 No dependency graph found — running full setup...');
  buildPnpmDependenciesGraph();
  installRequiredTooling();
  feedLocalPnpmStore();
} else {
  console.log('⚡ Skipping shared dependency install — graph already present.');
}
