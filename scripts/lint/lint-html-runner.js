#!/usr/bin/env node

/* eslint-disable */

const { spawnSync } = require("node:child_process");
const glob = require("glob");

const files = glob.sync("packages/**/*.html", {
  ignore: [
    "**/dist/**",
    "**/coverage/**",
    "**/www/**",
    "**/screenshot/**",
    "**/docs-api/**",
    "**/node_modules/**",
  ],
});

if (files.length === 0) {
  console.log("✅ No HTML files to lint.");
  process.exit(0);
}

// Run htmlhint and capture output
const result = spawnSync("htmlhint", files, { encoding: "utf8" });

// Filter out noisy “Config loaded” lines
const filtered = (result.stdout || "")
  .split("\n")
  .filter((line) => !line.includes("Config loaded:"))
  .join("\n");

if (filtered.trim()) {
  console.log(filtered);
}

if (result.stderr.trim()) {
  console.error(result.stderr);
}

// Preserve non-zero exit code
process.exit(result.status ?? 0);
