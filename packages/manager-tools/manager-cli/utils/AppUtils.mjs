import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const applicationsBasePath = resolve(__dirname, '../../../manager/apps');
export const modulesBasePath = resolve(__dirname, '../../../manager/modules');

/**
 * Check if a given app is a React application
 * @param appName
 * @returns {boolean}
 */
const isReactApp = (appName) => {
  try {
    const pkgPath = resolve(applicationsBasePath, appName, 'package.json');
    if (!existsSync(pkgPath)) return false;

    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    return (
      deps['react'] !== undefined &&
      deps['react-dom'] !== undefined
    );
  } catch (err) {
    console.error(`❌ Failed to read package.json for ${appName}`, err);
    return false;
  }
};

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

    // special projects cases
    join(applicationsBasePath, appName, 'src/alldoms/routes/routes.tsx'),
    join(applicationsBasePath, appName, 'src/core/routing/redirections.tsx'),
    join(applicationsBasePath, appName, 'src/core/routing/iframe-app-router.tsx'),
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


/**
 * Get all React applications
 * @returns {string[]}
 */
export const getReactApplications = () => {
  const allApps = getAvailableApps();
  return allApps.filter(isReactApp);
};
