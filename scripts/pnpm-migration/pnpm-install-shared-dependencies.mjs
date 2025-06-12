#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const forceRebuild = args.includes('--rebuild-graph');

const pnpmPath = path.resolve('./target/pnpm/pnpm');
const depsPath = path.resolve('./target/pnpm-dependencies.json');
const requiredTools = ['rollup@^3.29.4', 'typescript@^5.0.0', 'typescript@^5.8.2', ];
const REGISTRY = '--registry=https://registry.yarnpkg.com';

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
  if (!Array.isArray(requiredTools) || requiredTools.length === 0) {
    console.log('ℹ️ No tooling specified to install.');
    return;
  }

  console.log('🔧 Installing build tooling before running prepare scripts...');
  for (const tool of requiredTools) {
    try {
      execSync(`${pnpmPath} fetch ${tool} ${REGISTRY}`, { stdio: 'inherit' });
      console.log(`✅ Fetched ${tool} into PNPM store`);
    } catch (err) {
      console.error(`❌ Failed to fetch ${tool}:`, err.message);
      process.exit(1);
    }
  }
}

function feedLocalPnpmStore() {
  console.log('📦 Feeding PNPM store with internal packages...');
  const data = JSON.parse(readFileSync(depsPath, 'utf-8'));
  const pkgs = data.orderedInternalPackages || [];

  for (const pkg of pkgs) {
    const meta = data.all[pkg];
    if (meta?.path) {
      const fullPath = path.resolve(meta.path);
      console.log(`➡️ Installing ${pkg} from ${fullPath}`);
      try {
        execSync(`${pnpmPath} install --lockfile=false ${REGISTRY}`, {
          cwd: fullPath,
          stdio: 'inherit',
        });
      } catch (err) {
        console.error(`❌ Failed to install internal package ${pkg} at ${fullPath}:\n`, err.message);
        process.exit(1);
      }
    }
  }

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
