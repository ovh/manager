import fs from 'node:fs';
import path from 'node:path';

import { readJsonSafe } from './file-utils.js';
import { logError, logWarn } from './log-utils.js';

/**
 * Check if a given package.json belongs to a React app.
 */
export function isReactApp(pkgPath) {
  try {
    if (!fs.existsSync(pkgPath)) return false;

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    if (!pkg || typeof pkg !== 'object') return false;

    const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
    return Boolean(deps.react);
  } catch (err) {
    logWarn(`Failed to read or parse ${pkgPath}: ${err.message}`);
    return false;
  }
}

/**
 * Resolve app short name from package.json (fallback to folder).
 */
export function getAppShortName(pkgPath, folder) {
  const pkg = readJsonSafe(pkgPath) || {};
  return (pkg.name && String(pkg.name).replace(/^@ovh-ux\//, '')) || folder;
}

/**
 * Unified app info resolver.
 * - Ensures folder exists
 * - Ensures package.json exists
 * - Optionally enforces React app
 */
export function resolveAppInfo(appsDir, appFolder, { requireReact = false } = {}) {
  const appDir = path.join(appsDir, appFolder);
  if (!fs.existsSync(appDir)) {
    logError(`❌ App folder not found: ${appFolder} → skipping`);
    return null;
  }

  const pkgPath = path.join(appDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    logWarn(`⚠️ No package.json for ${appFolder}, skipping`);
    return null;
  }

  if (requireReact && !isReactApp(pkgPath)) {
    logWarn(`⚠️ ${appFolder} is not a React app, skipping`);
    return null;
  }

  return {
    appDir,
    pkgPath,
    appFolder,
    appShortName: getAppShortName(pkgPath, appFolder),
    pkg: readJsonSafe(pkgPath),
  };
}
