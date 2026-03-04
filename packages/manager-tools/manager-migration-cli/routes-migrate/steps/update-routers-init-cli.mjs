#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';

import { applicationsBasePath } from '../../utils/AppUtils.mjs';

const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');

const applicationPath = path.resolve(applicationsBasePath, appName);
const foldersToScan = ['src'];
const routerRegex = /\bcreate(Hash|Memory)Router\s*\(/;

/**
 * Recursively scans the given directory and collects .tsx files
 * containing `createHashRouter` or `createMemoryRouter` calls.
 *
 * @param {string} dir - Directory to scan
 * @param {Array<{ path: string, content: string }>} results - Accumulator for matched files
 * @returns {Promise<void>}
 */
const findRouterCallsFiles = async (dir, results) => {
  let entries;

  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    console.warn(`⚠️  Failed to read directory: ${dir} (${err.message})`);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await findRouterCallsFiles(fullPath, results);
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      try {
        const content = await fs.readFile(fullPath, 'utf-8');
        if (routerRegex.test(content)) {
          results.push({ path: fullPath, content });
        }
      } catch (err) {
        console.warn(`⚠️  Failed to read file: ${fullPath} (${err.message})`);
      }
    }
  }
};

/**
 * Scans all configured folders (e.g. `src/`) within the target app
 * for files initializing routers (`createHashRouter` or `createMemoryRouter`).
 *
 * @returns {Promise<Array<{ path: string, content: string }>>}
 */
const findRouterInitFiles = async () => {
  const results = [];

  for (const folder of foldersToScan) {
    const fullPath = path.join(applicationPath, folder);
    await findRouterCallsFiles(fullPath, results);
  }

  return results;
};

/**
 * Transforms router initialization code by:
 * - Removing old `routes` or `appRoutes` imports
 * - Replacing `createHashRouter(...)` with `createHashRouter(createRoutesFromElements(Routes))`
 * - Injecting `createRoutesFromElements` into imports
 * - Ensuring `Routes` import is added
 *
 * @param {string} code - Source code content
 * @returns {string} - Transformed code
 */
const updateRouterInitialization = (code) => {
  let transformed = code;

  // Remove old routes imports
  transformed = transformed.replace(
    /import\s+\{\s*(routes|appRoutes)\s*\}\s+from\s+['"][^'"]+['"];\n?/g,
    '',
  );
  transformed = transformed.replace(/import\s+(routes|appRoutes)\s+from\s+['"][^'"]+['"];\n?/g, '');

  // Update React import to include Suspense
  transformed = transformed.replace(
    /import\s+React\s+from\s+['"]react['"];/g,
    `import React, { Suspense } from 'react';`,
  );

  // Replace router assignments
  transformed = transformed.replace(
    /\bconst\s+(router|routes)\s*=\s*create(Hash|Memory)Router\s*\(([^)]*)\);?/g,
    (_, varName, type) => {
      return `const routes = create${type}Router(createRoutesFromElements(Routes));`;
    },
  );

  // Replace JSX usage of router
  transformed = transformed.replace(
    /<RouterProvider\s+router=\{router\}\s*\/>/g,
    `<Suspense fallback={<span>Loading routes ...</span>}><RouterProvider router={routes} /></Suspense>`,
  );

  // Inject createRoutesFromElements into react-router-dom imports
  transformed = transformed.replace(
    /import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];/g,
    (match, imports) => {
      const parts = imports
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      const required = ['RouterProvider', 'createRoutesFromElements'];
      for (const imp of required) {
        if (!parts.includes(imp)) parts.push(imp);
      }

      return `import { ${parts.join(', ')} } from 'react-router-dom';`;
    },
  );

  transformed = transformed.replace(
    /import\s+\{\s*Routes\s*\}\s+from\s+['"](@\/|(\.{1,2}\/)+)routes\/routes['"];?\n?/g,
    '',
  );

  // Add `import Routes from './routes/routes'` if missing
  if (!/import\s+Routes\s+from\s+['"][^'"]+routes['"]/.test(transformed)) {
    transformed = `import Routes from '@/routes/routes';\n` + transformed;
  }

  return transformed;
};

/**
 * Main entry point. Scans files using legacy router initialization
 * and updates them to use `createRoutesFromElements(Routes)` pattern.
 * Supports `--dry-run` mode for previewing changes.
 *
 * @returns {Promise<void>}
 */
const updateRoutersInitialization = async () => {
  const files = await findRouterInitFiles();

  if (files.length === 0) {
    console.log('ℹ️  No files using createHashRouter or createMemoryRouter found.');
    return;
  }

  for (const { path: filePath, content } of files) {
    try {
      const updated = updateRouterInitialization(content);
      let formatted;

      try {
        formatted = await prettier.format(updated, {
          parser: 'babel-ts',
          singleQuote: true,
          trailingComma: 'all',
          semi: true,
          printWidth: 100,
          arrowParens: 'always',
        });
      } catch (formatErr) {
        console.warn(`⚠️  Prettier formatting failed for ${filePath}: ${formatErr.message}`);
        formatted = updated;
      }

      if (isDryRun) {
        console.log(`\n🔍 Dry run: ${filePath}`);
        console.log('--- ORIGINAL ---');
        console.log(content.slice(0, 1000));
        console.log('--- TRANSFORMED ---');
        console.log(formatted.slice(0, 1000));
      } else {
        await fs.writeFile(filePath, formatted);
        console.log(`✅ Updated: ${filePath}`);
      }
    } catch (err) {
      console.warn(`⚠️  Failed to process: ${filePath} (${err.message})`);
    }
  }
};

// Start script
updateRoutersInitialization().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
