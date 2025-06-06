import fs, { existsSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { EXCLUDED_TESTS_DEPS } from './DependenciesUtils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const applicationsBasePath = resolve(__dirname, '../../manager/apps');

/**
 * Resolve all potential route file locations for a given app.
 * @param appName
 * @param verbose
 * @returns {null|string}
 */
export const resolveRoutePath = (appName, { verbose = false } = {}) => {
  const candidates = [
    join(applicationsBasePath, appName, 'src/routes/routes.tsx'),
    join(applicationsBasePath, appName, 'src/routes.tsx'),
    join(applicationsBasePath, appName, 'src/routes/index.tsx'),
  ];

  for (const path of candidates) {
    if (existsSync(path)) {
      if (verbose) console.log(`✅ Found route file for ${appName} → ${path}`);
      return path;
    }
  }

  if (verbose) console.log(`❌ No route file found for ${appName}`);
  return null;
};

/**
 * Read available react applications
 * @returns {string[]|*[]}
 */
export const getAvailableApps = () => {
  console.log(`ℹ️  Reading directory: ${applicationsBasePath}`);

  if (!existsSync(applicationsBasePath)) {
    console.error(`❌ Directory not found: ${applicationsBasePath}`);
    return [];
  }

  try {
    return readdirSync(applicationsBasePath).filter(name => {
      const fullPath = resolve(applicationsBasePath, name);
      return statSync(fullPath).isDirectory();
    });
  } catch (error) {
    console.error(`❌ Error reading app directory at ${applicationsBasePath}`);
    console.error(error);
    return [];
  }
};

export const hasSharedVitestConfig = (appPath) => {
  const configPath = path.join(appPath, 'vitest.config.js');
  if (!fs.existsSync(configPath)) return false;
  const content = fs.readFileSync(configPath, 'utf-8');
  return content.includes('mergeConfig') && content.includes('@ovh-ux/manager-tests-setup');
};

export const hasDeprecatedTestDeps = (deps) =>
  EXCLUDED_TESTS_DEPS.some(dep => dep in deps);

export const hasBabelConfigFiles = (appPath) => {
  const configFiles = ['.babelrc', 'babel.config.js'];
  return configFiles.some(file => fs.existsSync(path.join(appPath, file)));
};

export const hasBabelDeps = (deps) =>
  Object.keys(deps).some(dep => dep.startsWith('@babel/') || dep === 'babel-loader');
