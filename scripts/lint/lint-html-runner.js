#!/usr/bin/env node

/* eslint-disable */
const { spawn } = require("node:child_process");
const glob = require("glob");

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

const child = spawn("htmlhint", files, { shell: true });

child.stdout.on("data", (data) => {
  const lines = data
    .toString()
    .split("\n")
    // Filter out the “Config loaded” line(s)
    .filter((line) => !line.includes("Config loaded:"))
    .join("\n");

  if (lines.trim()) process.stdout.write(lines + "\n");
});

child.stderr.on("data", (data) => {
  // Pass through all stderr lines (errors, warnings, etc.)
  process.stderr.write(data.toString());
});

child.on("close", (code) => {
  if (code !== 0) {
    console.warn("\n⚠️  HTMLHint reported issues, but CI will continue.");
  } else {
    console.log("✅  HTMLHint passed with no issues.");
  }
  process.exit(0);
});
