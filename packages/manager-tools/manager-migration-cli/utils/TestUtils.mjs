import { existsSync, readFileSync } from 'fs';
import path from 'path';

import { applicationsBasePath } from './AppUtils.mjs';
import { EXCLUDED_TESTS_DEPS, readPackageJson } from './DependenciesUtils.mjs';

/**
 * Checks whether a given app has partially or fully migrated its Tests setup.
 * @param appName
 * @param verbose
 * @returns {'✅ Done' | '⚠️ Partial' | '📝 TODO'}
 */
export const getTestMigrationStatus = (appName, { verbose }) => {
  const appPath = path.join(applicationsBasePath, appName);
  const vitestConfigPath = path.join(appPath, 'vitest.config.js');

  let configMigrated = false;
  let scriptsMigrated = false;
  let depsCleaned = true;

  if (existsSync(vitestConfigPath)) {
    const content = readFileSync(vitestConfigPath, 'utf-8');
    configMigrated =
      content.includes('mergeConfig') && content.includes('@ovh-ux/manager-tests-setup');
    if (verbose) {
      console.log(
        `📄 ${appName}: vitest.config.js → ${configMigrated ? '✅ uses shared config' : '📝 legacy config'}`,
      );
    }
  }

  if (!configMigrated) return '📝 TODO';

  const packageContent = readPackageJson(appPath);
  if (packageContent) {
    const scripts = packageContent.scripts || {};
    scriptsMigrated = Object.values(scripts).some((cmd) => cmd.includes('manager-test'));

    const allDeps = { ...packageContent.dependencies, ...packageContent.devDependencies };
    depsCleaned = !EXCLUDED_TESTS_DEPS.some((dep) => dep in allDeps);

    if (verbose) {
      console.log(
        `📦 ${appName}: scripts → ${scriptsMigrated ? '✅ manager-test used' : '📝 vitest still used'}`,
      );
      console.log(
        `📦 ${appName}: dependencies → ${depsCleaned ? '✅ no deprecated deps' : '📝 still has vitest deps'}`,
      );
    }
  }

  return configMigrated && scriptsMigrated && depsCleaned ? '✅ Done' : '⚠️ Partial';
};
