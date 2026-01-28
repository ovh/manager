#!/usr/bin/env node
/**
 * Lint-staged runner for a multi-package monorepo.
 *
 * Goal:
 * - Read *staged* files only (what will actually be committed).
 * - Map each file to its “module root” directory (apps/modules/tools/components...).
 * - Run `yarn lint` (or `yarn lint -- <files>`) once per module root.
 *
 * Why:
 * - Much faster than “affected graph” approaches (Turbo/Nx) for pre-commit.
 * - Keeps the “each module owns its lint script” philosophy.
 */

import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/** Extensions we lint through this script. */
const LINTED_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

/**
 * Whether we pass only the staged files to the module lint command.
 * Turn off if your `yarn lint` scripts do not accept file arguments.
 */
const SHOULD_PASS_FILES_TO_LINTER = true;

/**
 * Known module root patterns.
 * If a staged file matches one of these, we extract a module root folder.
 */
const MODULE_ROOT_MATCHERS = [
  // packages/manager/apps/<appName>/...
  { pattern: /^packages\/manager\/apps\/([^/]+)\// },

  // packages/manager/modules/<moduleName>/...
  { pattern: /^packages\/manager\/modules\/([^/]+)\// },

  // packages/manager/core/<moduleName>/...
  { pattern: /^packages\/manager\/core\/([^/]+)\// },

  // packages/components/<moduleName>/...
  { pattern: /^packages\/components\/([^/]+)\// },

  // packages/manager-tools/manager-legacy-tools/<toolName>/...
  { pattern: /^packages\/manager-tools\/manager-legacy-tools\/([^/]+)\// },

  // packages/manager-tools/<toolName>/...
  { pattern: /^packages\/manager-tools\/([^/]+)\// },
];

/**
 * Some packages do not follow the “one more segment” rule (no submodules).
 * Example: packages/manager-ui-kit/...
 */
const FIXED_ROOT_PACKAGES = new Set(["packages/manager-ui-kit"]);

/* -------------------------------------------------------------------------------------------------
 * Shell helpers
 * ------------------------------------------------------------------------------------------------- */

function runCommandToString(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

function runCommandInDirectory(directory, command, args) {
  const result = spawnSync(command, args, {
    cwd: directory,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  return result.status ?? 1;
}

/* -------------------------------------------------------------------------------------------------
 * Path helpers
 * ------------------------------------------------------------------------------------------------- */

function toPosixPath(filePath) {
  // Git outputs POSIX paths on mac/linux; this normalizes Windows too.
  return filePath.replace(/\\/g, "/");
}

function getFileExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function hasPackageJson(moduleRootRelativePath) {
  const packageJsonPath = path.join(process.cwd(), moduleRootRelativePath, "package.json");
  return fileExists(packageJsonPath);
}

/**
 * Given a file path and a module root, returns the file path relative to module root.
 * Example:
 * - file: "packages/manager/apps/zimbra/src/App.tsx"
 * - root: "packages/manager/apps/zimbra"
 * - returns: "src/App.tsx"
 */
function getPathRelativeToModuleRoot(filePath, moduleRoot) {
  const relative = path.relative(moduleRoot, filePath);
  return toPosixPath(relative);
}

/* -------------------------------------------------------------------------------------------------
 * Git helpers
 * ------------------------------------------------------------------------------------------------- */

/**
 * Returns staged files only (index), not working tree changes.
 * - --cached : staged
 * - --diff-filter=ACMR : Added/Copied/Modified/Renamed (skip deletions)
 */
function getStagedFiles() {
  const output = runCommandToString("git diff --name-only --cached --diff-filter=ACMR");
  if (!output) return [];

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(toPosixPath);
}

/* -------------------------------------------------------------------------------------------------
 * Module root inference
 * ------------------------------------------------------------------------------------------------- */

/**
 * Returns the module root folder for a given file based on your monorepo layout.
 * Returns null if the file is not inside a known module area.
 */
function inferModuleRootFromFile(filePath) {
  // Fixed root packages (no submodule level)
  for (const fixedRoot of FIXED_ROOT_PACKAGES) {
    if (filePath === fixedRoot || filePath.startsWith(`${fixedRoot}/`)) {
      return fixedRoot;
    }
  }

  // Pattern-based roots (one extra segment after known folder)
  for (const matcher of MODULE_ROOT_MATCHERS) {
    const match = filePath.match(matcher.pattern);
    if (!match) continue;

    // match[0] is the full prefix like: "packages/manager/apps/zimbra/"
    const matchedPrefixWithTrailingSlash = match[0];
    const moduleRoot = matchedPrefixWithTrailingSlash.slice(0, -1); // remove trailing "/"
    return moduleRoot;
  }

  return null;
}

/* -------------------------------------------------------------------------------------------------
 * Grouping logic
 * ------------------------------------------------------------------------------------------------- */

/**
 * Filters for lintable file extensions.
 */
function filterLintableFiles(files) {
  return files.filter((filePath) => LINTED_EXTENSIONS.has(getFileExtension(filePath)));
}

/**
 * Builds a map: moduleRoot -> staged files in that module.
 * Only includes module roots that contain a package.json (workspace boundary).
 */
function groupFilesByModuleRoot(lintableFiles) {
  const filesByRoot = new Map();

  for (const filePath of lintableFiles) {
    const moduleRoot = inferModuleRootFromFile(filePath);
    if (!moduleRoot) continue;

    if (!hasPackageJson(moduleRoot)) continue;

    const existing = filesByRoot.get(moduleRoot) ?? [];
    existing.push(filePath);
    filesByRoot.set(moduleRoot, existing);
  }

  return filesByRoot;
}

/* -------------------------------------------------------------------------------------------------
 * Lint runner
 * ------------------------------------------------------------------------------------------------- */

function buildLintCommandArgs(moduleRoot, stagedFilesInModule) {
  // Use -s (silent) to reduce Yarn noise; still prints lint output.
  // If your command is different (lint:fix etc.), change it here.
  const baseArgs = ["-s", "lint"];

  if (!SHOULD_PASS_FILES_TO_LINTER) {
    return baseArgs;
  }

  // Pass only the staged files *relative to the module root*.
  // Many `eslint` scripts accept file arguments after `--`.
  const relativeFiles = stagedFilesInModule.map((filePath) =>
    getPathRelativeToModuleRoot(filePath, moduleRoot),
  );

  return [...baseArgs, "--", ...relativeFiles];
}

function lintModuleRoot(moduleRoot, stagedFilesInModule) {
  const absoluteModuleRoot = path.join(process.cwd(), moduleRoot);
  const lintArgs = buildLintCommandArgs(moduleRoot, stagedFilesInModule);

  console.log(`\n— Running lint in: ${moduleRoot}`);
  if (SHOULD_PASS_FILES_TO_LINTER) {
    console.log(`  Files: ${stagedFilesInModule.length}`);
  }

  const exitCode = runCommandInDirectory(absoluteModuleRoot, "yarn", lintArgs);
  return exitCode;
}

/* -------------------------------------------------------------------------------------------------
 * Main
 * ------------------------------------------------------------------------------------------------- */

function main() {
  const stagedFiles = getStagedFiles();
  const lintableFiles = filterLintableFiles(stagedFiles);
  console.log({
    lintableFiles,
    stagedFiles,
  })

  if (lintableFiles.length === 0) {
    process.exit(0);
  }

  const filesByModuleRoot = groupFilesByModuleRoot(lintableFiles);
console.log({
    filesByModuleRoot
  })
  if (filesByModuleRoot.size === 0) {
    process.exit(0);
  }

  // Run sequentially to keep output readable & fail fast.
  for (const [moduleRoot, moduleFiles] of filesByModuleRoot.entries()) {
    console.log({
    moduleRoot, moduleFiles
  })
    const exitCode = lintModuleRoot(moduleRoot, moduleFiles);
    if (exitCode !== 0) {
      process.exit(exitCode);
    }
  }

  process.exit(0);
}

main();
