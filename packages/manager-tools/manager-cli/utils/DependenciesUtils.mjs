import { readFileSync, existsSync, writeFileSync } from 'fs';
import path from 'path';
import { applicationsBasePath } from './AppUtils.mjs';

export const babelConfigurationFiles = ['.babelrc', 'babel.config.js'];

export const UNIT_TEST_CONFIG_PKG = '@ovh-ux/manager-tests-setup';

export const UNIT_TEST_CONFIG_VERSION = 'latest';

export const TS_EXCLUDED_DEPENDENCIES = /^(typescript(-eslint)?|tslib|ts-node|tsconfig)/;

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

export const EXCLUDED_ESLINT_FILES = [
  '.eslintrc',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.json',
  'eslint.config.js',
  '.eslintignore',
];

export const ESLINT_DEP_REGEX = /^(eslint|@typescript-eslint|eslint-plugin|@html-eslint|@vitest\/eslint-plugin|@tanstack\/eslint-plugin|prettier|globals|tailwind-csstree|typescript-eslint)/;

/**
 * Read package json content
 * @param appPath
 * @returns {any|null}
 */
export const readPackageJson = (appPath) => {
  const pkgPath = path.join(appPath, 'package.json');
  if (!existsSync(pkgPath)) return null;
  return JSON.parse(readFileSync(pkgPath, 'utf-8'));
};

/**
 * Update package json content
 * @param appPath
 * @param pkg
 * @returns {boolean}
 */
export const writePackageJson = (appPath, pkg) => {
  const pkgPath = path.join(appPath, 'package.json');
  if (!existsSync(pkgPath)) return false;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
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
  const actParts = actual.replace(/[^0-9.]/g, '').split('.').map(Number);
  for (let i = 0; i < reqParts.length; i++) {
    if ((actParts[i] || 0) > reqParts[i]) return true;
    if ((actParts[i] || 0) < reqParts[i]) return false;
  }
  return true;
};

/**
 * Resolves the actual package name from the app folder name.
 * @param {string} appName - The folder name like 'pci-block-storage'.
 * @returns {string|null} The real package name from package.json.
 */
export const getPackageNameFromApp = (appName) => {
  try {
    const pkgPath = path.resolve(applicationsBasePath, appName, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    return pkg.name || null;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return null;
  }
};
