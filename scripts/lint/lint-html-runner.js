#!/usr/bin/env node

/* eslint-disable */

const { execSync } = require("node:child_process");
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
  console.log("No HTML files to lint.");
  process.exit(0);
}

try {
  // Run once for all files — clean output, no repeated “Config loaded”
  execSync(`htmlhint ${files.join(" ")}`, { stdio: "inherit" });
} catch {
  process.exitCode = 1;
}

