import { readPackageJson, writePackageJson } from '../../../utils/DependenciesUtils.mjs';

/**
 * Updates test scripts by replacing `vitest` with `manager-test`.
 * @param appPath
 * @param dryRun
 * @returns {Promise<{newContent: null, updatedKeys: *[], updated: boolean}|{newContent: string, updatedKeys: *[], updated: boolean}>}
 */
export const updateTestScripts = async (appPath, dryRun) => {
  const pkg = readPackageJson(appPath);
  if (!pkg) {
    console.warn(`⚠️ package.json not found or invalid in ${appPath}`);
    return { updated: false, updatedKeys: [], newContent: null };
  }

  const scripts = { ...pkg.scripts };
  const original = { ...scripts };
  const updatedKeys = [];

  for (const [key, val] of Object.entries(scripts)) {
    if (typeof val === 'string' && val.includes('vitest')) {
      scripts[key] = val.replace(/\bvitest\b/g, 'manager-test');
      updatedKeys.push(key);
    }
  }

  if (updatedKeys.length === 0) {
    console.log('ℹ️ No vitest-related scripts found to update.');
    return { updated: false, updatedKeys, newContent: null };
  }

  const newPkg = { ...pkg, scripts };
  const newContent = JSON.stringify(newPkg, null, 2) + '\n';

  console.log(`📜 Original scripts:\n${JSON.stringify(original, null, 2)}\n`);
  console.log(`🧪 Updated keys: ${updatedKeys.join(', ')}`);
  console.log(`📜 Updated scripts:\n${JSON.stringify(scripts, null, 2)}\n`);

  if (!dryRun) {
    writePackageJson(appPath, newPkg);
    console.log('✅ Test scripts successfully updated.');
  } else {
    console.log('🧪 [dry-run] Would update test scripts in package.json.');
  }

  console.log(`📦 Resulting package.json:\n${newContent}`);

  return { updated: true, updatedKeys, newContent };
};
