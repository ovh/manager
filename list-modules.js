#!/usr/bin/env node
/**
 * Recursively lists all module package paths inside packages/manager/modules/*
 * that contain a package.json file.
 *
 * Example output:
 * [
 *   "packages/manager/modules/account",
 *   "packages/manager/modules/billing",
 *   ...
 * ]
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const MODULES_DIR = path.join(ROOT, "packages/components");

/**
 * Recursively find all directories that contain a package.json file
 */
function findPackageDirs(dir, result = []) {
  if (!fs.existsSync(dir)) return result;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const pkgJson = path.join(fullPath, "package.json");
      if (fs.existsSync(pkgJson)) {
        // Normalize to POSIX-style relative path
        const rel = path.relative(ROOT, fullPath).split(path.sep).join("/");
        result.push(rel);
      } else {
        // Recurse deeper (some modules may have nested packages)
        findPackageDirs(fullPath, result);
      }
    }
  }

  return result;
}

const modules = findPackageDirs(MODULES_DIR);
modules.sort();

console.log(JSON.stringify(modules, null, 2));
