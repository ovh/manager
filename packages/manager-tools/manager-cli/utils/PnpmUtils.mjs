import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the PNPM catalog path.
 * Catalog lives in manager-pm package, under src/playbook/catalog/pnpm-catalog.json
 */
const catalogPath = path.resolve(
  __dirname,
  '../../manager-pm/src/playbook/catalog/pnpm-catalog.json',
);

let pnpmCatalog = [];
if (fs.existsSync(catalogPath)) {
  try {
    pnpmCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    console.log(`✅ Loaded PNPM catalog from ${catalogPath}`);
  } catch (err) {
    console.warn(`⚠️ Failed to parse PNPM catalog: ${err.message}`);
  }
} else {
  console.warn(`⚠️ PNPM catalog not found at: ${catalogPath}`);
}

/**
 * Check if the target is in pnpm-catalog.json
 */
function isInPnpmCatalog(target, targetBasePath) {
  return pnpmCatalog.some((pnpmTargetEntry) => {
    const targetFullPath = `${targetBasePath}/${target}`;
    return pnpmTargetEntry === targetFullPath;
  });
}

/**
 * Compute PNPM migration status
 */
export function getPnpmMigrationStatus(target, targetBasePath, { verbose = false } = {}) {
  try {
    const isTargetInCatalog = isInPnpmCatalog(target, targetBasePath);

    if (verbose) {
      console.log(`📦 ${target}: pnpm migration status → ${isTargetInCatalog ? '✅' : '📝'}`);
    }

    if (isTargetInCatalog) {
      return '✅ Done';
    }

    return `📝 TODO — ${target} is not inside pnpm catalog`;
  } catch (err) {
    if (verbose) {
      console.error(`⚠️ Error while checking PNPM migration for ${target}: ${err.message}`);
    }
    return '📝 TODO — error';
  }
}
