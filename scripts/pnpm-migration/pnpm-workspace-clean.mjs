#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve('.');
const CLEAN_ROOT = path.resolve('./packages');
const FOLDERS_TO_REMOVE = new Set(['dist', '.turbo', 'node_modules', 'target']);

async function findAndRemoveDirs(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      if (FOLDERS_TO_REMOVE.has(entry.name)) {
        console.log(`🧹 Removing ${entryPath}`);
        await fs.rm(entryPath, { recursive: true, force: true });
      } else {
        await findAndRemoveDirs(entryPath); // recurse
      }
    }
  }
}

(async () => {
  console.log('🧼 Cleaning root and packages/ folders (node_modules, dist, etc.)...');
  await findAndRemoveDirs(ROOT_DIR);
  await findAndRemoveDirs(CLEAN_ROOT);
  console.log('✅ Cleanup complete. Ready for fresh install.');
})();
