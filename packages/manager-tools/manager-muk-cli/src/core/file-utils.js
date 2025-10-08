import fs from 'node:fs';
import path from 'node:path';

import { logger } from '../utils/log-manager.js';

/**
 * Utility: convert kebab-case to PascalCase.
 * Example: "breadcrumb-item" → "BreadcrumbItem"
 * @param {string} name
 * @returns {string}
 */
export function toPascalCase(name) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Create directory recursively if it doesn't exist.
 * @param {string} dirPath
 */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.info(`📁 Created folder: ${dirPath}`);
  }
}

/**
 * Safely create a file with content.
 * - Ensures parent directory exists
 * - Avoids overwriting existing files
 * - Handles write errors gracefully
 * - Automatically trims leading blank lines
 *
 * @param {string} filePath - Absolute path of the file to create
 * @param {string} content - File content
 */
export function createFile(filePath, content = '') {
  try {
    // ✅ Ensure the parent directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`📁 Created folder: ${dirPath}`);
    }

    // ✅ Only create if not already existing
    if (fs.existsSync(filePath)) {
      logger.info(`ℹ File already exists, skipping: ${filePath}`);
      return;
    }

    fs.writeFileSync(filePath, content.trimStart() + '\n', 'utf8');
    logger.info(`📝 Created file: ${filePath}`);
  } catch (err) {
    logger.error(`❌ Failed to create file at ${filePath}: ${err.message}`);
  }
}

/**
 * Safely read a file, returning an empty string if it doesn't exist.
 * Logs a warning when missing, optionally controlled by a flag.
 *
 * @param {string} filePath - Absolute file path to read.
 * @param {boolean} [warnIfMissing=true] - Whether to log a warning if file is missing.
 * @returns {string} - File contents (or empty string if not found).
 */
export function readFile(filePath, warnIfMissing = true) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      if (warnIfMissing) logger.warn(`⚠ File not found: ${filePath}`);
      return '';
    }
    throw err;
  }
}

/**
 * Safely overwrite a file with new content.
 * - Ensures parent directory exists
 * - Overwrites existing file content
 * - Trims leading blank lines
 *
 * @param {string} filePath
 * @param {string} content
 */
export function writeFile(filePath, content = '') {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`📁 Created folder: ${dirPath}`);
    }

    fs.writeFileSync(filePath, content.trimStart() + '\n', 'utf8');
    logger.info(`📝 Updated file: ${filePath}`);
  } catch (err) {
    logger.error(`❌ Failed to write file at ${filePath}: ${err.message}`);
  }
}
