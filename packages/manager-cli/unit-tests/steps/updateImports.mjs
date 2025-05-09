#!/usr/bin/env node

import fs from 'fs';
import glob from 'fast-glob';
import prettier from 'prettier';

/**
 * Adds ESLint disable comment above vitest imports in test files.
 * @param {string} appPath - Absolute path to the app directory.
 * @param {boolean} dryRun - If true, do not write changes to disk.
 */
export const updateImports = async (appPath, dryRun = false) => {
  const pattern = [
    `${appPath}/src/**/*.{test,spec}.{ts,tsx}`,
    `${appPath}/src/**/test.setup.{ts,tsx}`,
    `${appPath}/src/**/setupTests.{ts,tsx}`,
    `${appPath}/src/**/test-setup.{ts,tsx}`,
    `${appPath}/src/**/testUtils.{ts,tsx}`,
  ];
  const files = await glob(pattern, { absolute: true });

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf-8');
    const lines = original.split('\n');

    let modified = false;
    const newLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/^\s*import\s+\{[^}]*\}\s+from\s+['"]vitest['"]/.test(line)) {
        const previous = lines[i - 1]?.trim();
        const isAlreadyCommented =
          previous === '// eslint-disable-next-line import/no-extraneous-dependencies';

        if (!isAlreadyCommented) {
          newLines.push('// eslint-disable-next-line import/no-extraneous-dependencies');
          modified = true;
        }
      }

      newLines.push(line);
    }

    if (!modified) continue;

    const formatted = await prettier.format(newLines.join('\n'), {
      parser: file.endsWith('.ts') || file.endsWith('.tsx') ? 'babel-ts' : 'babel',
    });

    if (dryRun) {
      console.log(`🧪 [dry-run] Would add lint comment to: ${file}`);
    } else {
      fs.writeFileSync(file, formatted, 'utf-8');
      console.log(`✅ Added ESLint comment to: ${file}`);
    }
  }
};
