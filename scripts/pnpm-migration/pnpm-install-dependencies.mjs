#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';

const args = process.argv.slice(2).filter(Boolean);
const forwardArgs = args.join(' ');

const SHARED_SCRIPT = path.resolve('./scripts/pnpm-migration/pnpm-install-shared-dependencies.mjs');
const APP_SCRIPT = path.resolve('./scripts/pnpm-migration/pnpm-install-app-dependencies.mjs');

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

runSubScript('Shared Dependencies Install', SHARED_SCRIPT);
runSubScript('App Dependencies Install', APP_SCRIPT);
