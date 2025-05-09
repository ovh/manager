#!/usr/bin/env node

import fs from 'fs';
import glob from 'fast-glob';
import prettier from 'prettier';

/**
 * Updates test imports from 'vitest' to '@ovh-ux/manager-unit-tests-config'.
 * @param {string} appPath - Absolute path to the app directory.
 * @param {boolean} dryRun - If true, do not write changes to disk.
 */
export const updateImports = async (appPath, dryRun = false) => {
  const pattern = `${appPath}/src/**/*.{test,spec}.{ts,tsx}`;
  const files = await glob(pattern, { absolute: true });

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf-8');

    const replaced = original.replace(
      /import\s*\{([^}]+)\}\s*from\s*['"]vitest['"]/g,
      (_, imports) => {
        const names = imports
          .split(',')
          .map((name) => name.trim())
          .filter(Boolean)
          .join(', ');
        return `import { ${names} } from '@ovh-ux/manager-unit-tests-config'`;
      }
    );

    if (replaced === original) continue;

    const formatted = await prettier.format(replaced, {
      parser: file.endsWith('.ts') || file.endsWith('.tsx') ? 'babel-ts' : 'babel',
    });

    if (dryRun) {
      console.log(`🧪 [dry-run] Would update imports in: ${file}`);
    } else {
      fs.writeFileSync(file, formatted, 'utf-8');
      console.log(`✅ Updated imports in: ${file}`);
    }
  }
};
