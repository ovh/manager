import { existsSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const applicationsBasePath = resolve(__dirname, '../../manager/apps');

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
 * Dynamically resolve the path to a given app's route file.
 * @param {string} appName
 * @returns {string}
 */
export const getApplicationRoutesPath = (appName) =>
  join(applicationsBasePath, appName, 'src/routes/routes.tsx');

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
