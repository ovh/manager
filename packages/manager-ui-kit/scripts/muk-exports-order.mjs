#!/usr/bin/env node
/**
 * @file muk-exports-order.mjs
 * @description
 * Alphabetically sorts all export statements in given source files by their module path.
 * Groups exports by kind (`export`, `export *`, `export type`) while preserving
 * comments, blank lines, and section headers (e.g., // namespace, // types).
 *
 * Usage:
 *   node ./scripts/muk-exports-order.mjs
 *
 * Example integration:
 *   "scripts": {
 *     "lint:modern:fix": "yarn lint --fix && node ./scripts/muk-exports-order.mjs"
 *   }
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

/** @constant {string[]} TARGET_PATHS - List of files or directories to process. */
const TARGET_PATHS = [
  './src/hooks/index.ts',
  './src/components/index.ts',
  './src/commons/index.ts',
];

/**
 * Recursively collects all valid source files (.ts, .tsx, .js, .jsx)
 * from a given path (file or directory).
 *
 * @param {string} target - Path to file or directory to collect.
 * @returns {string[]} List of absolute file paths.
 */
function collectSourceFiles(target) {
  const absPath = resolve(target);
  const stats = statSync(absPath);

  if (stats.isFile()) {
    const ext = extname(absPath);
    return ['.ts', '.tsx', '.js', '.jsx'].includes(ext) ? [absPath] : [];
  }

  if (stats.isDirectory()) {
    return readdirSync(absPath)
      .flatMap((file) => collectSourceFiles(join(absPath, file)))
      .filter(Boolean);
  }

  return [];
}

/**
 * Extracts the module path from an export statement.
 * Example: "export { X } from './foo/bar';" → "./foo/bar"
 *
 * @param {string} line - A single line of code containing an export statement.
 * @returns {string} Extracted module path or empty string if none found.
 */
function extractPath(line) {
  const match = line.match(/['"](.*)['"]/);
  return match ? match[1] : '';
}

/**
 * Sorts all export statements in a given file alphabetically by their module path.
 * Groups by kind: `normal`, `export *`, and `export type`.
 *
 * @param {string} filePath - Absolute path to the file to process.
 * @returns {boolean} True if file content changed, false otherwise.
 */
function sortExportsInFile(filePath) {
  const original = readFileSync(filePath, 'utf8');
  const lines = original.split('\n');

  // Matches all forms of export statements
  const exportRegex =
    /^export(\s+type)?\s+.*from\s+['"].+['"];?|^export\s+\*\s+from\s+['"].+['"];?/;

  /** @type {{normal: string[], star: string[], type: string[]}} */
  const groups = { normal: [], star: [], type: [] };
  const header = [];
  const footer = [];

  let insideExports = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (exportRegex.test(trimmed)) {
      insideExports = true;

      if (trimmed.startsWith('export type')) groups.type.push(line);
      else if (trimmed.startsWith('export *')) groups.star.push(line);
      else groups.normal.push(line);
    } else if (!insideExports && trimmed) {
      header.push(line);
    } else if (insideExports && trimmed && !exportRegex.test(trimmed)) {
      footer.push(line);
    }
  }

  // Skip if no exports found
  if (!groups.normal.length && !groups.star.length && !groups.type.length) {
    console.log(`ℹ️  No exports found in ${filePath}`);
    return false;
  }

  // Sort each group alphabetically by module path
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => extractPath(a).localeCompare(extractPath(b)));
  }

  // Reconstruct file (header + sorted exports + footer)
  const newContent =
    [
      ...header,
      ...groups.normal,
      groups.normal.length ? '' : '',
      ...groups.star,
      groups.star.length ? '' : '',
      ...groups.type,
      groups.type.length ? '' : '',
      ...footer,
    ]
      .join('\n')
      .trimEnd() + '\n';

  if (newContent !== original) {
    writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Sorted exports in ${filePath}`);
    return true;
  }

  console.log(`ℹ️  No changes in ${filePath}`);
  return false;
}

/**
 * Main execution entry point.
 * Collects all target files, sorts their exports, and reports results.
 */
function main() {
  const allFiles = TARGET_PATHS.flatMap((path) => collectSourceFiles(path));

  if (allFiles.length === 0) {
    console.log('❌ No source files found.');
    process.exit(0);
  }

  console.log(`🔍 Sorting exports in ${allFiles.length} file(s)...\n`);

  let changed = 0;
  for (const file of allFiles) {
    if (sortExportsInFile(file)) changed++;
  }

  console.log(`\n✨ Done! ${changed} file(s) updated.`);
}

main();
