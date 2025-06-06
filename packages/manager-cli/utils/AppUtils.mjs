import { existsSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

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
