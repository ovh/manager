import {
  EXCLUDED_TESTS_DEPS,
  UNIT_TEST_CONFIG_PKG,
  UNIT_TEST_CONFIG_VERSION,
  readPackageJson,
  writePackageJson,
} from '../../../utils/DependenciesUtils.mjs';

/**
 * Removes deprecated test deps and adds the shared config package.
 * @param {string} appPath - Path to the app.
 * @param {boolean} dryRun - Preview changes only.
 * @param {string} [versionOverride] - Optional version override for shared config.
 * @returns {Promise<{ removedFromDeps: string[], removedFromDevDeps: string[], added: string[], updated: boolean }>}
 */
export const updateDependencies = async (appPath, dryRun, versionOverride) => {
  const pkg = readPackageJson(appPath);
  if (!pkg) {
    console.warn(`⚠️ No package.json found in ${appPath}`);
    return { removedFromDeps: [], removedFromDevDeps: [], added: [], updated: false };
  }

  const beforeDeps = { ...(pkg.dependencies || {}) };
  const beforeDevDeps = { ...(pkg.devDependencies || {}) };

  pkg.dependencies = pkg.dependencies || {};
  pkg.devDependencies = pkg.devDependencies || {};

  const removedFromDeps = [];
  const removedFromDevDeps = [];

  EXCLUDED_TESTS_DEPS.forEach((dep) => {
    if (pkg.dependencies[dep]) {
      removedFromDeps.push(dep);
      delete pkg.dependencies[dep];
    }
    if (pkg.devDependencies[dep]) {
      removedFromDevDeps.push(dep);
      delete pkg.devDependencies[dep];
    }
  });

  const added = [];
  const versionToInstall = versionOverride || UNIT_TEST_CONFIG_VERSION;
  if (!pkg.devDependencies[UNIT_TEST_CONFIG_PKG]) {
    pkg.devDependencies[UNIT_TEST_CONFIG_PKG] = versionToInstall;
    added.push(`${UNIT_TEST_CONFIG_PKG}@${versionToInstall}`);
  }

  const updated = removedFromDeps.length > 0 || removedFromDevDeps.length > 0 || added.length > 0;

  if (!updated) {
    console.log('ℹ️ No changes to dependencies.');
    return { removedFromDeps, removedFromDevDeps, added, updated: false };
  }

  console.log(`📦 Original dependencies:\n${JSON.stringify(beforeDeps, null, 2)}\n`);
  console.log(`📦 Original devDependencies:\n${JSON.stringify(beforeDevDeps, null, 2)}\n`);

  const newContent = JSON.stringify(pkg, null, 2) + '\n';

  if (!dryRun) {
    writePackageJson(appPath, pkg);
    console.log(`✅ Removed from dependencies: ${removedFromDeps.join(', ') || 'None'}`);
    console.log(`✅ Removed from devDependencies: ${removedFromDevDeps.join(', ') || 'None'}`);
    console.log(`✅ Added to devDependencies: ${added.join(', ') || 'None'}`);
  } else {
    console.log(
      `🧪 [dry-run] Would remove from dependencies: ${removedFromDeps.join(', ') || 'None'}`,
    );
    console.log(
      `🧪 [dry-run] Would remove from devDependencies: ${removedFromDevDeps.join(', ') || 'None'}`,
    );
    console.log(`🧪 [dry-run] Would add to devDependencies: ${added.join(', ') || 'None'}`);
  }

  console.log(`📦 Resulting package.json:\n${newContent}`);

  return { removedFromDeps, removedFromDevDeps, added, updated };
};
