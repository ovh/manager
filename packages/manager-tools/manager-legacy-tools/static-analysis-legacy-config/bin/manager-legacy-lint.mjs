#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import glob from "glob";

const require = createRequire(import.meta.url);

const argv = process.argv.slice(2);
const hasFlag = (f) => argv.includes(f);
const getFlagValue = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

const fix = hasFlag("--fix");
const cont = hasFlag("--continue");
const nonBlockingHtml = hasFlag("--non-blocking-html");
const kindsRaw = getFlagValue("--kinds") ?? "all";
const kinds = kindsRaw === "all"
  ? ["tsx", "js", "css", "html", "md"]
  : kindsRaw.split(",").map((s) => s.trim()).filter(Boolean);

const projectRoot = process.cwd();

function findUp(startDir, fileName) {
  let dir = startDir;
  while (true) {
    const candidate = path.join(dir, fileName);
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const turboJson = findUp(projectRoot, "turbo.json");
const rootPkg = findUp(projectRoot, "package.json");
const repoRoot = turboJson ? path.dirname(turboJson) : (rootPkg ? path.dirname(rootPkg) : process.cwd());

const rel = path.relative(repoRoot, projectRoot).split(path.sep).join("/");

function runNode(cliPath, args, { cwd }) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cliPath, ...args], {
      cwd,
      stdio: "inherit",
      shell: false
    });
    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

function resolveCli(modulePkgJsonPath, relativeCliPathFromPkgRoot) {
  const pkgJson = require.resolve(modulePkgJsonPath);
  const pkgRoot = path.dirname(pkgJson);
  return path.join(pkgRoot, relativeCliPathFromPkgRoot);
}

// ---- tool entrypoints (avoid .bin shims)
const eslintCli = resolveCli("eslint/package.json", "../bin/eslint.js");
const stylelintCli = resolveCli("stylelint/package.json", "./bin/stylelint.js");
const remarkCli = resolveCli("remark-cli/package.json", "../bin/remark"); // remark-cli exposes bin file
const htmlhintCli = resolveCli("htmlhint/package.json", "./bin/htmlhint"); // htmlhint exposes bin file

// ---- ignore patterns shared
const IGNORE_DIRS = [
  "**/dist/**",
  "**/coverage/**",
  "**/www/**",
  "**/screenshot/**",
  "**/docs-api/**",
  "**/node_modules/**"
];

// ---- scoped patterns per kind
function patternsFor(kind) {
  switch (kind) {
    case "tsx":
      return [`${rel}/**/*.{ts,tsx}`];
    case "js":
      return [`${rel}/**/*.js`];
    case "css":
      return [`${rel}/**/*.{css,less,scss}`];
    case "html":
      return [`${rel}/**/*.html`];
    case "md":
      return [`${rel}/**/*.md`];
    default:
      return [];
  }
}

async function runEslintTsx() {
  const cacheLocation = path.join(repoRoot, "node_modules/.cache/eslint-legacy", rel.replace(/\//g, "__"));
  const args = [
    "--quiet",
    "--cache",
    "--cache-location", cacheLocation,
    ...(fix ? ["--fix"] : []),
    ...patternsFor("tsx"),
    ...IGNORE_DIRS.flatMap((p) => ["--ignore-pattern", `${rel}/${p.replace("**/", "")}`])
  ];
  return runNode(eslintCli, args, { cwd: repoRoot });
}

async function runEslintJs() {
  const cacheLocation = path.join(repoRoot, "node_modules/.cache/eslint-legacy", rel.replace(/\//g, "__"));
  const args = [
    "--quiet",
    "--cache",
    "--cache-location", cacheLocation,
    ...(fix ? ["--fix"] : []),
    ...patternsFor("js"),
    ...IGNORE_DIRS.flatMap((p) => ["--ignore-pattern", `${rel}/${p.replace("**/", "")}`])
  ];
  return runNode(eslintCli, args, { cwd: repoRoot });
}

async function runStylelint() {
  const args = [
    ...(fix ? ["--fix"] : []),
    ...patternsFor("css"),
    "--allow-empty-input"
  ];
  return runNode(stylelintCli, args, { cwd: repoRoot });
}

async function runRemark() {
  // remark-cli supports -qf and accepts globs
  const args = [
    "-qf",
    ...patternsFor("md")
  ];
  return runNode(remarkCli, args, { cwd: repoRoot });
}

async function runHtmlhint() {
  const files = glob.sync(patternsFor("html")[0], {
    cwd: repoRoot,
    ignore: IGNORE_DIRS.map((p) => `${rel}/${p.replace("**/", "")}`)
  });

  if (files.length === 0) return 0;

  // batch to avoid E2BIG
  const BATCH = 100;
  let ok = true;

  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);

    // htmlhint is a bin, but we can still spawn "node <bin>" for stability across platforms
    const code = await runNode(htmlhintCli, batch, { cwd: repoRoot });
    if (code !== 0) ok = false;
  }

  if (!ok && nonBlockingHtml) return 0;
  return ok ? 0 : 1;
}

// ---- runner map
const RUNNERS = {
  tsx: runEslintTsx,
  js: runEslintJs,
  css: runStylelint,
  md: runRemark,
  html: runHtmlhint
};

const failures = [];

for (const k of kinds) {
  const fn = RUNNERS[k];
  if (!fn) continue;

  const code = await fn();
  if (code !== 0) {
    failures.push({ kind: k, code });
    if (!cont) break;
  }
}

if (failures.length) process.exit(1);
process.exit(0);
