import fs from 'fs';
import path from 'path';

/**
 * Updates the `package.json` test scripts of a given app:
 * - Replaces all occurrences of `vitest` with `manager-test`
 * - Future tasks
 *
 * This script supports dry-run mode to preview changes without writing to disk.
 *
 * @param {string} appPath - Absolute path to the application folder containing `package.json`.
 * @param {boolean} dryRun - If true, simulate changes without modifying files.
 */
export const updateTestScripts = async (appPath, dryRun) => {
  const pkgPath = path.join(appPath, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    console.warn(`⚠️ No package.json found in ${appPath}`);
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const scripts = { ...pkg.scripts };
  const original = { ...scripts };

  /** @type {string[]} */
  const updatedKeys = [];

  // Replace all `vitest` CLI entries with `manager-test`
  for (const [key, val] of Object.entries(scripts)) {
    if (typeof val === 'string' && val.includes('vitest')) {
      scripts[key] = val.replace(/\bvitest\b/g, 'manager-test');
      updatedKeys.push(key);
    }
  }

  if (updatedKeys.length === 0) {
    console.log('ℹ️ No vitest-related scripts found to update.');
    return;
  }

  console.log(`📜 Original scripts:\n${JSON.stringify(original, null, 2)}\n`);
  console.log(`🧪 Updated keys: ${updatedKeys.join(', ')}`);
  console.log(`📜 Updated scripts:\n${JSON.stringify(scripts, null, 2)}\n`);

  const newPkg = { ...pkg, scripts };
  const newContent = JSON.stringify(newPkg, null, 2) + '\n';

  if (!dryRun) {
    fs.writeFileSync(pkgPath, newContent, 'utf-8');
    console.log('✅ Test scripts successfully updated.');
  } else {
    console.log('🧪 [dry-run] Would update test scripts in package.json.');
  }

  console.log(`📦 Resulting package.json:\n${newContent}`);
};
