import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { applicationsBasePath } from './AppUtils.mjs';

// adjust if path differs

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
 * Check if the app is in pnpm-catalog.json
 */
function isInCatalog(app) {
  return pnpmCatalog.some((entry) => {
    // Normalize path entries like "packages/manager/apps/zimbra" -> "zimbra"
    const normalized = entry.replace(/^packages\/manager\/apps\//, '');
    return normalized === app;
  });
}

/**
 * Check if app's vitest.config.js/ts has dedupe: [...defaultDedupedDependencies]
 */
function hasDedupedDependencies(app, { verbose = false } = {}) {
  const jsPath = path.join(applicationsBasePath, app, 'vitest.config.js');
  const tsPath = path.join(applicationsBasePath, app, 'vitest.config.ts');

  const configPath = [jsPath, tsPath].find(fs.existsSync);
  if (!configPath) {
    if (verbose)
      console.log(`📦 ${app}: no vitest.config.js/ts found under ${applicationsBasePath}`);
    return false;
  }

  const content = fs.readFileSync(configPath, 'utf-8');

  if (verbose) {
    console.log(`📦 ${app}: checking ${configPath}`);
    console.log(
      content
        .split('\n')
        .filter((l) => l.includes('dedupe'))
        .join('\n'),
    );
  }

  // More permissive regex: allows spaces, newlines, trailing commas
  return /dedupe\s*:\s*\[\s*\.{3}\s*defaultDedupedDependencies\s*\],?/.test(content);
}

/**
 * Compute PNPM migration status
 */
export function getPnpmMigrationStatus(app, { verbose = false } = {}) {
  try {
    const inCatalog = isInCatalog(app);
    const hasDedupe = hasDedupedDependencies(app);

    if (verbose) {
      console.log(`📦 ${app}: inCatalog → ${inCatalog ? '✅' : '📝'}`);
      console.log(`📦 ${app}: vitest dedupe → ${hasDedupe ? '✅' : '📝'}`);
    }

    const missing = [];
    if (!inCatalog) missing.push('catalog');
    if (!hasDedupe) missing.push('dedupe');

    if (missing.length === 0) {
      return '✅ Done';
    }

    const hint = `missing: ${missing.join(', ')}`;
    const hasAny = inCatalog || hasDedupe;
    return hasAny ? `⚠️ Partial — ${hint}` : `📝 TODO — ${hint}`;
  } catch (err) {
    if (verbose) {
      console.error(`⚠️ Error while checking PNPM migration for ${app}: ${err.message}`);
    }
    return '📝 TODO — error';
  }
}
