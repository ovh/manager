import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '@yarnpkg/lockfile';

const { parse } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../../');
const YARN_LOCK = path.join(ROOT_DIR, 'yarn.lock');
const OUTPUT_FILE = path.join(ROOT_DIR, 'target/pnpm-dependencies.json');
const EXCLUDE_APPS_JSON = path.join(ROOT_DIR, 'scripts/pnpm-migration/exclude-yarn-apps.json');

const PACKAGE_DIRS = [
  'packages/manager',
  'packages/components',
  'packages/manager-react-components',
].map(sub => path.join(ROOT_DIR, sub));

function readJSON(filepath) {
  return JSON.parse(readFileSync(filepath, 'utf-8'));
}

function collectInternalPackagePaths() {
  const result = {};

  function walk(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') continue;
        walk(fullPath);
      } else if (entry.isFile() && entry.name === 'package.json') {
        try {
          const json = JSON.parse(readFileSync(fullPath, 'utf8'));
          if (json.name) {
            const relPath = path.relative(ROOT_DIR, path.dirname(fullPath));
            console.log(`📦 Found internal package: ${json.name} → ${relPath}`);
            result[json.name] = relPath;
          }
        } catch {
          console.warn(`⚠️ Could not parse ${fullPath}`);
        }
      }
    }
  }

  for (const dir of PACKAGE_DIRS) {
    if (existsSync(dir)) {
      walk(dir);
    } else {
      console.warn(`⚠️ Skipping missing directory: ${dir}`);
    }
  }

  return result;
}

function generateDependencyMapFromYarnLock(internalPaths) {
  console.log('🔍 Parsing yarn.lock for dependency ranges...');
  const raw = readFileSync(YARN_LOCK, 'utf8');
  const parsed = parse(raw);
  const lockEntries = Object.keys(parsed.object || {});
  const dependencyMap = {};

  for (const key of lockEntries) {
    const match = key.match(/^(@?[^@]+\/[^@]+)@(.+)/);
    if (!match) continue;

    const [, name, range] = match;

    const isInternal = range.startsWith('file:');
    const internalPath = isInternal && internalPaths[name] ? internalPaths[name] : null;

    if (!dependencyMap[name]) {
      dependencyMap[name] = {
        isInternal,
        path: internalPath,
        versions: [range],
      };
    } else if (!dependencyMap[name].versions.includes(range)) {
      dependencyMap[name].versions.push(range);
    }
  }

  console.log(`✅ Found ${Object.keys(dependencyMap).length} unique dependencies in yarn.lock`);
  return dependencyMap;
}

function addPnpmOnlyDepsFromApps(dependencyMap, internalPaths, pnpmOnlyApps) {
  console.log('➕ Adding dependencies from PNPM-only apps...');
  for (const appPath of pnpmOnlyApps) {
    const pkgPath = path.join(ROOT_DIR, appPath, 'package.json');
    if (!existsSync(pkgPath)) {
      console.warn(`⚠️ Skipped missing PNPM-only app package.json: ${appPath}`);
      continue;
    }

    const pkgJson = readJSON(pkgPath);
    const allDeps = {
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies,
      ...pkgJson.peerDependencies,
    };

    console.log(`🔍 Scanning ${appPath} for additional deps (${Object.keys(allDeps).length})`);

    for (const [dep, version] of Object.entries(allDeps)) {
      const isInternal = !!internalPaths[dep];
      const resolvedPath = isInternal ? internalPaths[dep] : null;

      if (!dependencyMap[dep]) {
        console.log(`➕ Adding PNPM-only dep: ${dep} (${version})`);
        dependencyMap[dep] = {
          isInternal,
          path: resolvedPath,
          versions: [version],
        };
      } else if (!dependencyMap[dep].versions.includes(version)) {
        console.log(`🔁 Adding new version for ${dep}: ${version}`);
        dependencyMap[dep].versions.push(version);
      }
    }
  }
}

function topologicalSortInternalPackages(dependencyMap, internalPaths) {
  console.log('🔗 Building internal dependency graph...');
  const graph = {};
  const visited = new Set();
  const result = [];

  for (const [pkgName, pkgMeta] of Object.entries(dependencyMap)) {
    if (!pkgMeta.isInternal) continue;

    const pkgJsonPath = path.join(ROOT_DIR, pkgMeta.path, 'package.json');
    if (!existsSync(pkgJsonPath)) continue;

    const pkgJson = readJSON(pkgJsonPath);
    const deps = Object.assign({}, pkgJson.dependencies, pkgJson.peerDependencies);
    graph[pkgName] = Object.keys(deps || {}).filter(dep => internalPaths[dep]);
  }

  function visit(name) {
    if (visited.has(name)) return;
    visited.add(name);
    for (const dep of graph[name] || []) {
      visit(dep);
    }
    result.push(name);
  }

  Object.keys(graph).forEach(visit);
  console.log(`📘 Topological install order resolved: ${result.length} internal packages`);
  return result;
}

function writeDependencyMap() {
  console.log('🧠 Building full dependency map...');
  const internalPaths = collectInternalPackagePaths();
  const allDeps = generateDependencyMapFromYarnLock(internalPaths);

  const pnpmOnlyApps = readJSON(EXCLUDE_APPS_JSON);
  addPnpmOnlyDepsFromApps(allDeps, internalPaths, pnpmOnlyApps);

  const orderedInternalPackages = topologicalSortInternalPackages(allDeps, internalPaths);

  const json = JSON.stringify(
    {
      orderedInternalPackages,
      all: allDeps,
    },
    null,
    2
  );

  writeFileSync(OUTPUT_FILE, json);
  console.log(`✅ Wrote full dependency map (including PNPM-only apps) to ${OUTPUT_FILE}`);
}

writeDependencyMap();
