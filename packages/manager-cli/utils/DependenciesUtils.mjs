import fs from 'fs';
import path from 'path';

export const babelConfigurationFiles = ['.babelrc', 'babel.config.js'];

export const UNIT_TEST_CONFIG_PKG = '@ovh-ux/manager-tests-setup';

export const UNIT_TEST_CONFIG_VERSION = 'latest';

export const REQUIRED_DEP_VERSIONS = {
  '@ovh-ux/manager-vite-config': '>=0.9.4',
  vite: '>=6.0.7',
};

export const EXCLUDED_TESTS_DEPS = [
  'vitest',
  '@vitest/ui',
  '@vitest/coverage-v8',
  '@vitejs/plugin-react',
  '@testing-library/jest-dom',
  '@testing-library/dom',
  '@testing-library/react',
  '@testing-library/user-event'
];

/**
 * Read package json content
 * @param appPath
 * @returns {any|null}
 */
export const readPackageJson = (appPath) => {
  const pkgPath = path.join(appPath, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
};

/**
 * Update package json content
 * @param appPath
 * @param pkg
 * @returns {boolean}
 */
export const writePackageJson = (appPath, pkg) => {
  const pkgPath = path.join(appPath, 'package.json');
  if (!fs.existsSync(pkgPath)) return false;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
  return true;
};

/**
 * Verify version
 * @param required
 * @param actual
 * @returns {boolean}
 */
export const satisfiesVersion = (required, actual) => {
  if (!actual || !required.startsWith('>=')) return false;
  const reqParts = required.replace('>=', '').split('.').map(Number);
  const actParts = actual.split('.').map(Number);
  for (let i = 0; i < reqParts.length; i++) {
    if ((actParts[i] || 0) > reqParts[i]) return true;
    if ((actParts[i] || 0) < reqParts[i]) return false;
  }
  return true;
};
