import fs from 'node:fs';

import { logWarn } from './log-utils.js';

/**
 * Check if a given package.json belongs to a React app.
 *
 * A package is considered a React app if it declares `react`
 * as a dependency, devDependency, or peerDependency.
 *
 * @param {string} pkgPath - Absolute path to a `package.json` file.
 * @returns {boolean} True if the package depends on React, otherwise false.
 */
export function isReactApp(pkgPath) {
  try {
    if (!fs.existsSync(pkgPath)) return false;

    /** @type {Record<string, any>} */
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    if (!pkg || typeof pkg !== 'object') return false;

    const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
    return Boolean(deps.react);
  } catch (err) {
    logWarn(`Failed to read or parse ${pkgPath}: ${err.message}`);
    return false;
  }
}
