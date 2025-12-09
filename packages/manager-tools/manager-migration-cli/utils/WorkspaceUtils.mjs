import { rm } from 'fs/promises';
import path from 'path';

import { applicationsBasePath } from './AppUtils.mjs';
import { readPackageJson, writePackageJson } from './DependenciesUtils.mjs';

/**
 * runCleanupStep
 * @param {object} config
 * @param {string} config.stepName                - "TypeScript" | "ESLint" | ...
 * @param {string} config.appName                 - app name (already parsed)
 * @param {boolean} config.isDryRun
 * @param {(name:string,version:string)=>boolean} [config.matchDevDep]  - devDep removal predicate
 * @param {(name:string,value:string)=>boolean}  [config.matchScript]   - script removal predicate
 * @param {string[]} [config.removeFilePaths]                             - absolute or app-relative file paths to delete
 */
export async function runCleanupStep(config) {
  const { stepName, appName, isDryRun, matchDevDep, matchScript, removeFilePaths = [] } = config;

  if (!appName || appName.startsWith('--')) {
    console.error('❌ Missing required <app-name> argument.');
    process.exit(1);
  }

  const appPath = path.join(applicationsBasePath, appName);
  const removedDeps = [];
  const removedScripts = [];
  const removedFiles = [];

  // 1) Load package.json
  const pkg = readPackageJson(appPath);

  // 2) Dev deps
  if (pkg.devDependencies && matchDevDep) {
    for (const [name, ver] of Object.entries(pkg.devDependencies)) {
      if (matchDevDep(name, ver)) {
        removedDeps.push(name);
        if (!isDryRun) delete pkg.devDependencies[name];
      }
    }
  }

  // 3) Scripts
  if (pkg.scripts && matchScript) {
    for (const [name, val] of Object.entries(pkg.scripts)) {
      if (matchScript(name, val)) {
        removedScripts.push(name);
        if (!isDryRun) delete pkg.scripts[name];
      }
    }
  }

  // 4) Files
  for (const relOrAbs of removeFilePaths) {
    const filePath = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(appPath, relOrAbs);
    try {
      if (!isDryRun) await rm(filePath, { recursive: true, force: true });
      removedFiles.push(path.relative(appPath, filePath));
    } catch {
      // ignore missing files
    }
  }

  // 5) Persist
  if (!isDryRun) writePackageJson(appPath, pkg);

  // 6) Summary
  console.log(`\n✅ ${stepName} legacy cleanup complete for "${appName}"`);
  if (removedFiles.length) console.log(`🧹 Removed files: ${removedFiles.join(', ')}`);
  if (removedDeps.length) console.log(`📦 Removed devDependencies: ${removedDeps.join(', ')}`);
  if (removedScripts.length) console.log(`📝 Removed scripts: ${removedScripts.join(', ')}`);
}
