import fs from 'fs';
import path from 'path';

const VITEST_DEPS = [
  'vitest',
  '@vitest/ui',
  '@vitest/coverage-v8',
  '@vitejs/plugin-react',
  '@testing-library/jest-dom',
  '@testing-library/dom',
  '@testing-library/react',
  '@testing-library/user-event'
];

const UNIT_TEST_CONFIG_PKG = '@ovh-ux/manager-tests-setup';
const UNIT_TEST_CONFIG_VERSION = '^0.0.1';

/**
 * Removes Vitest-related deps and adds the shared unit-test config.
 */
export const updateDependencies = async (appPath, dryRun) => {
  const pkgPath = path.join(appPath, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    console.warn(`⚠️ No package.json found in ${appPath}`);
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const beforeDeps = { ...(pkg.dependencies || {}) };
  const beforeDevDeps = { ...(pkg.devDependencies || {}) };

  pkg.dependencies = pkg.dependencies || {};
  pkg.devDependencies = pkg.devDependencies || {};

  const removedFromDeps = [];
  const removedFromDevDeps = [];

  VITEST_DEPS.forEach((dep) => {
    if (pkg.dependencies[dep]) {
      removedFromDeps.push(dep);
      delete pkg.dependencies[dep];
    }
    if (pkg.devDependencies[dep]) {
      removedFromDevDeps.push(dep);
      delete pkg.devDependencies[dep];
    }
  });

  // Add shared config package if not already present
  const added = [];
  if (!pkg.devDependencies[UNIT_TEST_CONFIG_PKG]) {
    pkg.devDependencies[UNIT_TEST_CONFIG_PKG] = UNIT_TEST_CONFIG_VERSION;
    added.push(`${UNIT_TEST_CONFIG_PKG}@${UNIT_TEST_CONFIG_VERSION}`);
  }

  const removed = [...removedFromDeps, ...removedFromDevDeps];
  if (removed.length === 0 && added.length === 0) {
    console.log('ℹ️ No changes to dependencies.');
    return;
  }

  console.log(`📦 Original dependencies:\n${JSON.stringify(beforeDeps, null, 2)}\n`);
  console.log(`📦 Original devDependencies:\n${JSON.stringify(beforeDevDeps, null, 2)}\n`);

  const newPackageJsonContent = JSON.stringify(pkg, null, 2) + '\n';

  if (!dryRun) {
    fs.writeFileSync(pkgPath, newPackageJsonContent, 'utf-8');
    console.log(`✅ Removed from dependencies: ${removedFromDeps.join(', ') || 'None'}`);
    console.log(`✅ Removed from devDependencies: ${removedFromDevDeps.join(', ') || 'None'}`);
    console.log(`✅ Added to devDependencies: ${added.join(', ') || 'None'}`);
  } else {
    console.log(`🧪 [dry-run] Would remove from dependencies: ${removedFromDeps.join(', ') || 'None'}`);
    console.log(`🧪 [dry-run] Would remove from devDependencies: ${removedFromDevDeps.join(', ') || 'None'}`);
    console.log(`🧪 [dry-run] Would add to devDependencies: ${added.join(', ') || 'None'}`);
  }

  console.log(`📦 Resulting package.json:\n${newPackageJsonContent}`);
};
