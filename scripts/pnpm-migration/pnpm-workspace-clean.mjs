#!/usr/bin/env node
import { rmSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';
import { registerCleanupOnSignals } from './utils/cleanup-utils.mjs';

const ROOT_DIR = resolve('.');
const TARGET_DIR = join(ROOT_DIR, 'target');
const PNPM_STORE = join(TARGET_DIR, '.pnpm-store');
const TURBO_DIR = join(ROOT_DIR, '.turbo');
const GLOB_DIRS = ['packages'];

function removeDirIfExists(dirPath, label) {
  if (existsSync(dirPath)) {
    try {
      rmSync(dirPath, { recursive: true, force: true });
      console.log(`🧹 Removed ${label}: ${dirPath}`);
    } catch (err) {
      console.warn(`⚠️ Failed to remove ${dirPath}:`, err.message);
    }
  }
}

// Register signal-safe cleanup
registerCleanupOnSignals(() => {
  console.log('🧼 Cleanup triggered via signal. No temporary files to restore in this script.');
});

function removeAllNodeModules(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') {
        removeDirIfExists(fullPath, 'node_modules');
        continue;
      }
      // Recurse
      removeAllNodeModules(fullPath);
    }
  }
}

function removeAllWorkspaceYamlFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      removeAllWorkspaceYamlFiles(fullPath);
    } else if (entry.isFile() && entry.name === 'pnpm-workspace.yaml') {
      removeDirIfExists(fullPath, 'pnpm-workspace.yaml');
    }
  }
}

function cleanWorkspace() {
  console.log('🧼 Cleaning PNPM workspace...');

  removeDirIfExists(PNPM_STORE, 'PNPM Store');
  removeDirIfExists(TURBO_DIR, '.turbo');

  for (const dir of GLOB_DIRS) {
    const fullPath = join(ROOT_DIR, dir);
    if (existsSync(fullPath)) {
      removeAllNodeModules(fullPath);
      removeAllWorkspaceYamlFiles(fullPath);
    }
  }

  console.log('✅ PNPM workspace cleaned successfully.');
}

cleanWorkspace();
