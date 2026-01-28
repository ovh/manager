#!/usr/bin/env node
/**
 * Fast monorepo lint-staged runner:
 * - reads staged files only
 * - maps each staged file to a module root
 * - runs lint per module root (deduped)
 *
 * Supports repo layout:
 * - packages/manager/apps/<app>/**
 * - packages/manager/modules/<module>/**
 * - packages/manager/core/<module>/**
 * - packages/components/<module>/**
 * - packages/manager-tools/<tool>/**
 * - packages/manager-tools/manager-legacy-tools/<tool>/**
 * - packages/manager-ui-kit/** (fixed root, no submodules)
 */

import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/** File extensions that trigger lint. */
const LINTED_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

/**
 * Choose what you want in pre-commit.
 * - true  => try to auto-fix (prefer lint:fix)
 * - false => prefer lint (no fix), fallback lint:fix
 */
const PREFER_FIX_SCRIPT = true;

/**
 * Pass file arguments to the lint command if possible.
 * This is faster (eslint runs on few files) but only safe if the script accepts args.
 * We'll enable it only for scripts that look like ESLint commands.
 */
const ALLOW_FILE_ARGS_WHEN_SAFE = true;

/** Some packages don’t have submodules: the root is the package itself. */
const FIXED_ROOT_PACKAGES = new Set(["packages/manager-ui-kit"]);

/** Patterns that identify module roots by “one segment after a base folder”. */
const MODULE_ROOT_PATTERNS = [
  /^packages\/manager\/apps\/[^/]+\//,
  /^packages\/manager\/modules\/[^/]+\//,
  /^packages\/manager\/core\/[^/]+\//,
  /^packages\/components\/[^/]+\//,
  /^packages\/manager-tools\/manager-legacy-tools\/[^/]+\//,
  /^packages\/manager-tools\/[^/]+\//,
];

/* -------------------------------------------------------------------------------------------------
 * Small utilities
 * ------------------------------------------------------------------------------------------------- */

function toPosixPath(p) {
  return p.replace(/\\/g, "/");
}

function readText(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

function fileExists(absolutePath) {
  return fs.existsSync(absolutePath);
}

function readJson(absolutePath) {
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function runYarnScript(moduleRootAbsPath, scriptName, scriptArgs) {
  // Yarn 1 forwards args to scripts without needing "--"
  const yarnArgs = ["-s", scriptName, ...scriptArgs];

  const result = spawnSync("yarn", yarnArgs, {
    cwd: moduleRootAbsPath,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  return result.status ?? 1;
}

/* -------------------------------------------------------------------------------------------------
 * Git staged files
 * ------------------------------------------------------------------------------------------------- */

function getStagedFiles() {
  // Added/Copied/Modified/Renamed; exclude deletions so we don’t lint removed files.
  const output = readText("git diff --name-only --cached --diff-filter=ACMR");
  if (!output) return [];
  return output.split("\n").map((s) => toPosixPath(s.trim())).filter(Boolean);
}

function isLintableFile(filePath) {
  return LINTED_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

/* -------------------------------------------------------------------------------------------------
 * Module root inference
 * ------------------------------------------------------------------------------------------------- */

function inferModuleRoot(filePath) {
  // Fixed roots (no submodule level)
  for (const fixedRoot of FIXED_ROOT_PACKAGES) {
    if (filePath === fixedRoot || filePath.startsWith(`${fixedRoot}/`)) {
      return fixedRoot;
    }
  }

  // Pattern-based roots
  for (const pattern of MODULE_ROOT_PATTERNS) {
    const match = filePath.match(pattern);
    if (!match) continue;

    // match[0] looks like "packages/manager/apps/zimbra/"
    return match[0].slice(0, -1); // remove trailing "/"
  }

  return null;
}

function getModulePackageJsonPath(moduleRootRelPath) {
  return path.join(process.cwd(), moduleRootRelPath, "package.json");
}

function loadModulePackageJson(moduleRootRelPath) {
  const packageJsonPath = getModulePackageJsonPath(moduleRootRelPath);
  if (!fileExists(packageJsonPath)) return null;
  return readJson(packageJsonPath);
}

/* -------------------------------------------------------------------------------------------------
 * Choosing which script to run (lint vs lint:fix)
 * ------------------------------------------------------------------------------------------------- */

function pickLintScriptName(modulePackageJson) {
  const scripts = modulePackageJson?.scripts ?? {};

  const hasLint = typeof scripts.lint === "string";
  const hasLintFix = typeof scripts["lint:fix"] === "string";

  if (PREFER_FIX_SCRIPT) {
    if (hasLintFix) return "lint:fix";
    if (hasLint) return "lint";
  } else {
    if (hasLint) return "lint";
    if (hasLintFix) return "lint:fix";
  }

  return null;
}

/**
 * Heuristic to decide whether it’s safe to pass file args.
 * We only do it when the chosen script looks like it runs eslint directly.
 */
function canSafelyPassFiles(modulePackageJson, lintScriptName) {
  if (!ALLOW_FILE_ARGS_WHEN_SAFE) return false;

  const scriptCommand = modulePackageJson?.scripts?.[lintScriptName];
  if (typeof scriptCommand !== "string") return false;

  // Common safe cases: eslint / nx eslint / turbo eslint wrappers
  // If your repo uses a custom wrapper that accepts files, add it here.
  const looksLikeEslint =
    scriptCommand.includes("eslint") ||
    scriptCommand.includes("@nx/eslint") ||
    scriptCommand.includes("nx lint");

  return looksLikeEslint;
}

/* -------------------------------------------------------------------------------------------------
 * Group staged files by module
 * ------------------------------------------------------------------------------------------------- */

function groupStagedFilesByModuleRoot(stagedFiles) {
  /** @type {Map<string, string[]>} */
  const filesByModuleRoot = new Map();

  for (const filePath of stagedFiles) {
    if (!isLintableFile(filePath)) continue;

    const moduleRoot = inferModuleRoot(filePath);
    if (!moduleRoot) continue;

    if (!filesByModuleRoot.has(moduleRoot)) {
      filesByModuleRoot.set(moduleRoot, []);
    }
    filesByModuleRoot.get(moduleRoot).push(filePath);
  }

  return filesByModuleRoot;
}

/* -------------------------------------------------------------------------------------------------
 * Main runner
 * ------------------------------------------------------------------------------------------------- */

function runLintForModule(moduleRootRelPath, stagedFilesInModule) {
  const moduleRootAbsPath = path.join(process.cwd(), moduleRootRelPath);
  const modulePackageJson = loadModulePackageJson(moduleRootRelPath);

  if (!modulePackageJson) {
    console.log(`\n— Skip: ${moduleRootRelPath} (no package.json)`);
    return 0;
  }

  const lintScriptName = pickLintScriptName(modulePackageJson);
  if (!lintScriptName) {
    console.log(`\n— Skip: ${moduleRootRelPath} (no lint/lint:fix script)`);
    return 0;
  }

  const shouldPassFiles = canSafelyPassFiles(modulePackageJson, lintScriptName);

  const fileArgs = shouldPassFiles
    ? stagedFilesInModule.map((filePath) =>
        toPosixPath(path.relative(moduleRootRelPath, filePath)),
      )
    : [];

  console.log(`\n— Running ${lintScriptName} in: ${moduleRootRelPath}`);
  console.log(`  Staged files in module: ${stagedFilesInModule.length}`);
  if (shouldPassFiles) console.log(`  Passing files to linter: yes`);
  else console.log(`  Passing files to linter: no`);

  return runYarnScript(moduleRootAbsPath, lintScriptName, fileArgs);
}

function main() {
  const stagedFiles = getStagedFiles();
  console.log(stagedFiles);
  if (stagedFiles.length === 0) process.exit(0);

  const filesByModuleRoot = groupStagedFilesByModuleRoot(stagedFiles);
  console.log(filesByModuleRoot);
  if (filesByModuleRoot.size === 0) process.exit(0);

  // Sequential execution: readable output + fail-fast.
  for (const [moduleRoot, moduleFiles] of filesByModuleRoot.entries()) {
    const exitCode = runLintForModule(moduleRoot, moduleFiles);
    if (exitCode !== 0) process.exit(exitCode);
  }

  process.exit(0);
}

main();
