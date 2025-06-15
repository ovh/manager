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
const EXCLUDE_APPS_JSON = path.join(ROOT_DIR, 'scripts/pnpm-migration/settings/exclude-yarn-apps.json');

const PACKAGE_DIRS = [
  'packages/manager',
  'packages/manager/modules',
  'packages/components',
  'packages/manager-react-components',
].map(sub => path.join(ROOT_DIR, sub));

function readJSON(filepath) {
  return JSON.parse(readFileSync(filepath, 'utf-8'));
}

function collectInternalPackagePathsAndPrivacy() {
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
            result[json.name] = {
              path: relPath,
              private: !!json.private,
            };
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

function generateDependencyMapFromYarnLock(internalInfo) {
  const raw = readFileSync(YARN_LOCK, 'utf8');
  const parsed = parse(raw);
  const lockEntries = Object.keys(parsed.object || {});
  const dependencyMap = {};

  for (const key of lockEntries) {
    const match = key.match(/^(@?[^@]+\/[^@]+)@(.+)/);
    if (!match) continue;

    const [, name, range] = match;

    const isInternal = range.startsWith('file:');
    const internalData = internalInfo[name] || {};
    const internalPath = isInternal ? internalData.path || null : null;

    if (!dependencyMap[name]) {
      dependencyMap[name] = {
        isInternal,
        path: internalPath,
        versions: [range],
        private: isInternal ? !!internalData.private : undefined,
      };
    } else if (!dependencyMap[name].versions.includes(range)) {
      dependencyMap[name].versions.push(range);
    }
  }

  return dependencyMap;
}

function addPnpmOnlyDepsFromApps(dependencyMap, internalInfo, pnpmOnlyApps) {
  for (const appPath of pnpmOnlyApps) {
    const pkgPath = path.join(ROOT_DIR, appPath, 'package.json');
    if (!existsSync(pkgPath)) continue;

    const pkgJson = readJSON(pkgPath);
    const allDeps = {
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies,
      ...pkgJson.peerDependencies,
    };

    for (const [dep, version] of Object.entries(allDeps)) {
      const internalMeta = internalInfo[dep] || {};
      const isInternal = !!internalMeta.path;

      if (!dependencyMap[dep]) {
        dependencyMap[dep] = {
          isInternal,
          path: internalMeta.path || null,
          versions: [version],
          private: isInternal ? !!internalMeta.private : undefined,
        };
      } else if (!dependencyMap[dep].versions.includes(version)) {
        dependencyMap[dep].versions.push(version);
      }
    }
  }
}

function topologicalSortInternalPackages(dependencyMap, internalInfo) {
  const graph = {};
  const visited = new Set();
  const result = [];

  for (const [pkgName, pkgMeta] of Object.entries(dependencyMap)) {
    if (!pkgMeta.isInternal) continue;

    const pkgJsonPath = path.join(ROOT_DIR, pkgMeta.path, 'package.json');
    if (!existsSync(pkgJsonPath)) continue;

    const pkgJson = readJSON(pkgJsonPath);
    const deps = Object.assign({}, pkgJson.dependencies, pkgJson.peerDependencies);
    graph[pkgName] = Object.keys(deps || {}).filter(dep => internalInfo[dep]);
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
  return result;
}

function writeDependencyMap() {
  const internalInfo = collectInternalPackagePathsAndPrivacy();
  const allDeps = generateDependencyMapFromYarnLock(internalInfo);

  const pnpmOnlyApps = readJSON(EXCLUDE_APPS_JSON);
  addPnpmOnlyDepsFromApps(allDeps, internalInfo, pnpmOnlyApps);

  const orderedInternalPackages = topologicalSortInternalPackages(allDeps, internalInfo);

  const output = {
    orderedInternalPackages,
    all: allDeps,
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`✅ Wrote enhanced dependency map to ${OUTPUT_FILE}`);
}

writeDependencyMap();
