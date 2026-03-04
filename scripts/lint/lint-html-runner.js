#!/usr/bin/env node

/* eslint-disable */
const { spawnSync } = require("node:child_process");
const glob = require("glob");

const BATCH_SIZE = 100; // avoid E2BIG: run in small groups

const files = glob.sync("packages/**/*.html", {
  ignore: [
    "packages/**/dist/**",
    "packages/**/coverage/**",
    "packages/**/www/**",
    "packages/**/screenshot/**",
    "packages/**/docs-api/**",
    "packages/**/node_modules/**",
  ],
});

if (files.length === 0) {
  console.log("No HTML files to lint.");
  process.exit(0);
}

console.log(`▶️  Running htmlhint on ${files.length} files...\n`);

let hasErrors = false;
for (let i = 0; i < files.length; i += BATCH_SIZE) {
  const batch = files.slice(i, i + BATCH_SIZE);
  const result = spawnSync("htmlhint", batch, { encoding: "utf-8" });

  // Filter stdout (remove "Config loaded" lines)
  const stdout = result.stdout
    .split("\n")
    .filter((line) => !line.includes("Config loaded:"))
    .join("\n")
    .trim();

  if (stdout) console.log(stdout);

  if (result.status !== 0) hasErrors = true;
}

if (hasErrors) {
  console.warn("\n⚠️  HTMLHint reported issues, but CI will continue.");
} else {
  console.log("✅  HTMLHint passed with no issues.");
}

// Always success (non-blocking in CI)
process.exit(0);