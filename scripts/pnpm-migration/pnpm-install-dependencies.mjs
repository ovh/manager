#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';

// CLI args handling
const args = process.argv.slice(2).filter(Boolean);
const forwardArgs = args.join(' ');

// Script paths
const SHARED_SCRIPT = path.resolve('./scripts/pnpm-migration/pnpm-install-shared-dependencies.mjs');
const APP_SCRIPT = path.resolve('./scripts/pnpm-migration/pnpm-install-app-dependencies.mjs');

// Delay utility
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run sub-script wrapper
function runSubScript(name, scriptPath) {
  console.log(`🚀 Running ${name}...`);
  try {
    execSync(`node ${scriptPath} ${forwardArgs}`, { stdio: 'inherit' });
    console.log(`✅ ${name} completed.`);
  } catch (err) {
    console.error(`❌ ${name} failed:`, err.message);
    process.exit(1);
  }
}

// Main logic with delay before each install
async function main() {
  const delayMs = 2000;

  console.log(`⏳ Waiting ${delayMs / 1000} seconds before starting Shared Dependencies Install...`);
  await sleep(delayMs);
  runSubScript('Shared Dependencies Install', SHARED_SCRIPT);

  console.log(`⏳ Waiting ${delayMs / 1000} seconds before starting App Dependencies Install...`);
  await sleep(delayMs);
  runSubScript('App Dependencies Install', APP_SCRIPT);
}

main();
