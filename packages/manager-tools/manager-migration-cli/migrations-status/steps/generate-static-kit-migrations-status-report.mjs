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
 *   node static-kit-status.js [--dry-run] [--format json|html] [--app <name>]
 */
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import stripJsonComments from 'strip-json-comments';

import { applicationsBasePath, getReactApplications } from '../../utils/AppUtils.mjs';
import { buildStaticKitReportFileName, renderReport } from '../../utils/ExportUtils.mjs';
import { parseCliArgs } from '../../utils/ScriptUtils.mjs';

const cliArgs = parseCliArgs(process.argv);

/** Constants for Static Kit compliance */
const STATIC_KIT_PKG = '@ovh-ux/manager-static-analysis-kit';

// New normalized scripts (modern way)
const REQUIRED_SCRIPTS = ['lint', 'lint:fix'];

// nsure scripts are modern (manager-lint) and NOT legacy (manager-legacy-lint)
const MODERN_LINT_CMD = 'manager-lint';
const LEGACY_LINT_CMD = 'manager-legacy-lint';

const STATIC_KIT_ESLINT_INCREMENTAL_CONFIG = '@ovh-ux/manager-static-analysis-kit/eslint';
const STATIC_KIT_ESLINT_FULL_CONFIG = 'eslintSharedConfig';
const STATIC_KIT_TS_CONFIG = '@ovh-ux/manager-static-analysis-kit/tsconfig/react';
const STATIC_KIT_TS_STRICT_CONFIG = '@ovh-ux/manager-static-analysis-kit/tsconfig/react-strict';

/**
 * Safely parse a JSON file that may contain comments.
 */
const parseJsonWithComments = (filePath, appName) => {
  try {
    const raw = readFileSync(filePath, 'utf-8');

    // Remove comments first
    const withoutComments = stripJsonComments(raw);

    // Remove trailing commas (in arrays and objects)
    const withoutTrailingCommas = withoutComments
      .replace(/,\s*}/g, '}') // trailing comma before }
      .replace(/,\s*]/g, ']'); // trailing comma before ]

    return JSON.parse(withoutTrailingCommas);
  } catch (err) {
    console.log(`❌ ${appName}: Failed to parse ${path.basename(filePath)} → ${err.message}`);
    return null;
  }
};

/**
 * Check if a given application is compliant with Static Analysis Kit requirements.
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
    if (cliArgs.dryRun) console.log(`❌ ${appName}: Missing ${STATIC_KIT_PKG} in devDependencies`);
  }

  // 2. Disallow direct eslint dependencies (keeps your original intent, but fixed)
  const allDeps = { ...deps, ...devDeps };
  const hasBannedDeps = Object.keys(allDeps).some((dep) => dep.startsWith('eslint'));
  if (hasBannedDeps) {
    eslintOk = false;
    if (cliArgs.dryRun) console.log(`❌ ${appName}: Contains banned eslint deps`);
  }

  // 3. Check required scripts exist (lint + lint:fix)
  for (const script of REQUIRED_SCRIPTS) {
    if (!scripts[script]) {
      eslintOk = false;
      if (cliArgs.dryRun) console.log(`❌ ${appName}: Missing script ${script}`);
    }
  }

  // 3bis. Ensure scripts are modern, not legacy
  const lintScript = scripts.lint || '';
  const lintFixScript = scripts['lint:fix'] || '';

  const isModernLint =
    lintScript.includes(MODERN_LINT_CMD) && !lintScript.includes(LEGACY_LINT_CMD);

  const isModernLintFix =
    lintFixScript.includes(MODERN_LINT_CMD) && !lintFixScript.includes(LEGACY_LINT_CMD);

  if (!isModernLint) {
    eslintOk = false;
    if (cliArgs.dryRun) {
      console.log(`❌ ${appName}: "lint" is not modern → ${lintScript}`);
    }
  }

  if (!isModernLintFix) {
    eslintOk = false;
    if (cliArgs.dryRun) {
      console.log(`❌ ${appName}: "lint:fix" is not modern → ${lintFixScript}`);
    }
  }

  // 4. Validate eslint.config.mjs
  if (existsSync(eslintConfigPath)) {
    const rawEslintConfig = readFileSync(eslintConfigPath, 'utf-8');
    const content = stripJsonComments(rawEslintConfig).trim();
    if (
      content?.includes?.(STATIC_KIT_ESLINT_INCREMENTAL_CONFIG) ||
      content?.includes?.(STATIC_KIT_ESLINT_FULL_CONFIG)
    ) {
      eslintUsesStaticKit = true;
    }
    if (!eslintUsesStaticKit && cliArgs.dryRun) {
      console.log(`❌ ${appName}: eslint.config.mjs does not import from static-analysis-kit`);
    }
  } else {
    eslintOk = false;
    if (cliArgs.dryRun) console.log(`❌ ${appName}: eslint.config.mjs missing`);
  }

  eslintOk = eslintOk && eslintUsesStaticKit;

  // 5. Validate tsconfig.json
  if (!existsSync(tsconfigPath)) {
    tsOk = false;
    if (cliArgs.dryRun) console.log(`❌ ${appName}: tsconfig.json missing`);
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
        if (cliArgs.dryRun) {
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
 * Generate a status report for React applications and render it.
 */
const generateStaticKitStatusReport = () => {
  let apps = getReactApplications();
  if (cliArgs.app) {
    apps = apps.filter((a) => a === cliArgs.app);
  }

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
    format: cliArgs.format,
    filename: buildStaticKitReportFileName(cliArgs.format),
  });
};

// Run the report generator
generateStaticKitStatusReport();
