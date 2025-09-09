#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { applicationsBasePath, modulesBasePath } from '../../utils/AppUtils.mjs';

// Helpers to get dirname equivalent in ESM
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Hardcoded common folder path (constant)
const commonFolder = path.resolve(
  dirname,
  `${modulesBasePath}/common-translations/public/translations/`,
);

const args = process.argv.slice(2);
const appName = args[0];
const projectRoot = process.cwd();
const appFolder = path.resolve(dirname, `${applicationsBasePath}/${appName}/public/translations/`);
const targetFileName = 'Messages_fr_FR.json';

/**
 *
 * Read a JSON file if it exists, returns empty object otherwise.
 * @param {string} filepath
 * @returns {any|null}
 */
const readJSONFileIfExists = (filepath) => {
  try {
    const raw = readFileSync(filepath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read/parse JSON: ${filepath}`, err.message);
    return null;
  }
};

/**
 * Recursively collect all target JSON files named `Messages_fr_FR.json`.
 */
const getAllTargetJsonFiles = (folderPath) => {
  let results = [];

  const entries = readdirSync(folderPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllTargetJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name === targetFileName) {
      results.push(fullPath);
    }
  });

  return results;
};

/**
 * Load all values from matching common translation files.
 * Maps each value to the file(s) it appears in.
 */
const loadCommonValueMap = (folder) => {
  const valueMap = new Map();
  const files = getAllTargetJsonFiles(folder);

  files.forEach((file) => {
    const content = readJSONFileIfExists(file);
    if (!content) return;

    Object.values(content).forEach((val) => {
      if (!valueMap.has(val)) {
        valueMap.set(val, new Set());
      }
      valueMap.get(val).add(path.relative(projectRoot, file));
    });
  });

  return valueMap;
};

/**
 * Scan source folder for duplicate values, mapped to common file locations.
 */
const findDuplicatesGroupedByCommonFiles = (sourceDir, commonValueMap) => {
  const files = getAllTargetJsonFiles(sourceDir);
  const report = [];

  files.forEach((file) => {
    const data = readJSONFileIfExists(file);
    if (!data) return;

    const grouped = new Map(); // commonFilesKey => [ { key, value } ]
    Object.entries(data).forEach(([key, value]) => {
      const commonFiles = commonValueMap.get(value);
      if (commonFiles) {
        const commonFilesKey = Array.from(commonFiles).sort().join(', ');
        if (!grouped.has(commonFilesKey)) {
          grouped.set(commonFilesKey, []);
        }
        grouped.get(commonFilesKey).push({ key, value });
      }
    });

    if (grouped.size > 0) {
      report.push({
        sourceFile: path.relative(projectRoot, file),
        groups: Array.from(grouped.entries()).map(([commonFilesKey, entries]) => ({
          commonFilesKey,
          entries,
        })),
      });
    }
  });

  return report;
};

// -------------------- Main Script --------------------
const checkDuplicatedTranslations = async () => {
  if (!existsSync(commonFolder) || !statSync(commonFolder).isDirectory()) {
    console.error('❌ Common folder path is invalid or does not exist.');
    return false;
  }
  if (!existsSync(appFolder) || !statSync(appFolder).isDirectory()) {
    console.error('❌ Source folder path is invalid or does not exist.');
    return false;
  }

  const commonValueMap = loadCommonValueMap(commonFolder);
  const report = findDuplicatesGroupedByCommonFiles(appFolder, commonValueMap);

  if (report.length === 0) {
    console.log('✅ No duplicates found.');
  } else {
    console.log('\n🚨 Duplicates Report:\n');

    report.forEach(({ sourceFile, groups }) => {
      console.log(`Source File: ${sourceFile}`);
      groups.forEach(({ commonFilesKey, entries }) => {
        console.log(`  - ${commonFilesKey}`);
        entries.forEach(({ key, value }) => {
          console.log(`     - Key: "${key}" => Value: "${value}"`);
        });
      });
      console.log('');
    });
  }

  return true;
};

// Start script
checkDuplicatedTranslations().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
