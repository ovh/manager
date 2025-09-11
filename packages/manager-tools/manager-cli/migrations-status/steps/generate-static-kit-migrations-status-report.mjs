#!/usr/bin/env node
/**
 * @fileoverview CLI tool to generate a migration status report for applications migrating
 * to the Static Analysis Kit (ESLint + TypeScript configurations).
 * It validates each app for:
 * - Static Analysis Kit dependency presence
 * - ESLint config compliance
 * - TypeScript config compliance
 * - Required scripts in package.json
 *
 * Usage:
 *   node static-kit-status.js [--dry-run] [--format json|html]
 */
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import stripJsonComments from 'strip-json-comments';

import { applicationsBasePath, getReactApplications } from '../../utils/AppUtils.mjs';
import { buildStaticKitReportFileName, renderReport } from '../../utils/ExportUtils.mjs';

/** CLI arguments */
const args = process.argv.slice(2);
/** Run without making changes */
const isDryRun = args.includes('--dry-run');
/** Optional output format (json, html, etc.) */
const formatArgIndex = args.findIndex((arg) => arg === '--format');
const format = formatArgIndex !== -1 ? args[formatArgIndex + 1] : null;

/** Constants for Static Kit compliance */
const STATIC_KIT_PKG = '@ovh-ux/manager-static-analysis-kit';
const REQUIRED_SCRIPTS = ['lint:modern', 'lint:modern:fix'];
const STATIC_KIT_ESLINT_CONFIG = '@ovh-ux/manager-static-analysis-kit/eslint';
const STATIC_KIT_TS_CONFIG = '@ovh-ux/manager-static-analysis-kit/tsconfig/react';
const STATIC_KIT_TS_STRICT_CONFIG = '@ovh-ux/manager-static-analysis-kit/tsconfig/react-strict';

/**
 * Safely parse a JSON file that may contain comments.
 *
 * @param {string} filePath - Path to the JSON file.
 * @param {string} appName - Application name (for error reporting).
 * @returns {object|null} Parsed JSON object, or null on failure.
 */
const parseJsonWithComments = (filePath, appName) => {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const cleaned = stripJsonComments(raw);
    return JSON.parse(cleaned);
  } catch (err) {
    if (isDryRun) {
      console.log(`❌ ${appName}: Failed to parse ${path.basename(filePath)} → ${err.message}`);
    }
    return null;
  }
};

/**
 * Check if a given application is compliant with Static Analysis Kit requirements.
 *
 * Rules:
 * - Must include @ovh-ux/manager-static-analysis-kit in devDependencies
 * - Must not have eslint/typescript directly in dependencies
 * - Must define lint:modern and lint:modern:fix scripts
 * - Must have eslint.config.mjs importing the static kit config
 * - tsconfig.json must extend static-kit tsconfig/react or tsconfig/react-strict
 *
 * @param {string} appName - Application folder name.
 * @returns {{eslint: string, ts: string}} Compliance status.
 */
const checkStaticKitCompliance = (appName) => {
  const appPath = path.join(applicationsBasePath, appName);
  const pkgPath = path.join(appPath, 'package.json');
  const tsconfigPath = path.join(appPath, 'tsconfig.json');
  const eslintConfigPath = path.join(appPath, 'eslint.config.mjs');

  let eslintOk = true;
  let tsOk = true;
  let eslintUsesStaticKit = false;

  // Validate package.json
  if (!existsSync(pkgPath)) return { eslint: '📝 TODO', ts: '📝 TODO' };
  const pkg = parseJsonWithComments(pkgPath, appName);
  if (!pkg) return { eslint: '📝 TODO', ts: '📝 TODO' };

  const devDeps = pkg.devDependencies || {};
  const deps = pkg.dependencies || {};
  const scripts = pkg.scripts || {};

  // 1. Check Static Kit dependency
  if (!devDeps[STATIC_KIT_PKG]) {
    eslintOk = false;
    if (isDryRun) console.log(`❌ ${appName}: Missing ${STATIC_KIT_PKG} in devDependencies`);
  }

  // 2. Disallow direct eslint/typescript dependencies
  const hasBannedDeps = Object.keys({ ...deps, ...devDeps }).some(
    (dep) => dep === 'typescript' || dep.startsWith('eslint'),
  );
  if (hasBannedDeps) {
    eslintOk = false;
    if (isDryRun) console.log(`❌ ${appName}: Contains banned eslint/typescript deps`);
  }

  // 3. Check required scripts
  for (const script of REQUIRED_SCRIPTS) {
    if (!scripts[script]) {
      eslintOk = false;
      if (isDryRun) console.log(`❌ ${appName}: Missing script ${script}`);
    }
  }

  // 4. Validate eslint.config.mjs
  if (existsSync(eslintConfigPath)) {
    const rawEslintConfig = readFileSync(eslintConfigPath, 'utf-8');
    const content = stripJsonComments(rawEslintConfig).trim();
    if (content?.includes?.(STATIC_KIT_ESLINT_CONFIG)) {
      eslintUsesStaticKit = true;
    }
    if (!eslintUsesStaticKit && isDryRun) {
      console.log(`❌ ${appName}: eslint.config.mjs does not import from static-analysis-kit`);
    }
  } else {
    eslintOk = false;
    if (isDryRun) console.log(`❌ ${appName}: eslint.config.mjs missing`);
  }

  eslintOk = eslintOk && eslintUsesStaticKit;

  // 5. Validate tsconfig.json
  if (!existsSync(tsconfigPath)) {
    tsOk = false;
    if (isDryRun) console.log(`❌ ${appName}: tsconfig.json missing`);
  } else {
    const tsconfig = parseJsonWithComments(tsconfigPath, appName);
    if (!tsconfig) {
      tsOk = false;
    } else {
      const baseExtends = tsconfig.extends;
      if (
        !baseExtends?.includes?.(STATIC_KIT_TS_CONFIG) &&
        !baseExtends?.includes?.(STATIC_KIT_TS_STRICT_CONFIG)
      ) {
        tsOk = false;
        if (isDryRun) {
          console.log(`❌ ${appName}: tsconfig extends is not compliant → ${baseExtends}`);
        }
      }
    }
  }

  return {
    eslint: eslintOk ? '✅ Done' : '📝 TODO',
    ts: tsOk ? '✅ Done' : '📝 TODO',
  };
};

/**
 * Generate a status report for all React applications and render it
 * in the specified format (console table, JSON, HTML, etc.).
 *
 * @returns {void}
 */
const generateStaticKitStatusReport = () => {
  const apps = getReactApplications();
  const report = apps.map((app) => {
    const result = checkStaticKitCompliance(app);
    return {
      Application: app,
      'ESLint Migration': result.eslint,
      'TypeScript Migration': result.ts,
    };
  });

  renderReport(report, {
    title: 'Follow Up Static Kit Migration',
    statusKeys: ['ESLint Migration', 'TypeScript Migration'],
    format,
    filename: buildStaticKitReportFileName(format),
  });
};

// Run the report generator
generateStaticKitStatusReport();
