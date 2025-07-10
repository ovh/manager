#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import stripJsonComments from 'strip-json-comments';
import { getReactApplications, applicationsBasePath } from '../../utils/AppUtils.mjs';
import { buildStaticKitReportFileName, renderReport } from '../../utils/ExportUtils.mjs';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const formatArgIndex = args.findIndex(arg => arg === '--format');
const format = formatArgIndex !== -1 ? args[formatArgIndex + 1] : null;

const STATIC_KIT_PKG = '@ovh-ux/manager-static-analysis-kit';
const REQUIRED_SCRIPTS = ['lint:modern', 'lint:modern:fix', 'build:strict'];

const parseJsonWithComments = (filePath, appName) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const cleaned = stripJsonComments(raw);
    return JSON.parse(cleaned);
  } catch (err) {
    if (isDryRun) {
      console.log(`❌ ${appName}: Failed to parse ${path.basename(filePath)} → ${err.message}`);
    }
    return null;
  }
};

const checkStaticKitCompliance = (appName) => {
  const appPath = path.join(applicationsBasePath, appName);
  const pkgPath = path.join(appPath, 'package.json');
  const tsconfigPath = path.join(appPath, 'tsconfig.json');
  const tsconfigStrictPath = path.join(appPath, 'tsconfig.strict.json');
  const eslintConfigPath = path.join(appPath, 'eslint.config.mjs');

  let eslintOk = true;
  let tsOk = true;
  let eslintUsesStaticKit = false;

  // Check package.json
  if (!fs.existsSync(pkgPath)) return { eslint: '📝 TODO', ts: '📝 TODO' };
  const pkg = parseJsonWithComments(pkgPath, appName);
  if (!pkg) return { eslint: '📝 TODO', ts: '📝 TODO' };

  const devDeps = pkg.devDependencies || {};
  const deps = pkg.dependencies || {};
  const scripts = pkg.scripts || {};

  // 1. static-analysis-kit present in devDependencies
  if (!devDeps[STATIC_KIT_PKG]) {
    eslintOk = false;
    if (isDryRun) console.log(`❌ ${appName}: Missing ${STATIC_KIT_PKG} in devDependencies`);
  }

  // 2. no direct eslint or typescript deps
  const hasBannedDeps = Object.keys({ ...deps, ...devDeps }).some(
    (dep) => dep === 'typescript' || dep.startsWith('eslint')
  );
  if (hasBannedDeps) {
    eslintOk = false;
    if (isDryRun) console.log(`❌ ${appName}: Contains banned eslint/typescript deps`);
  }

  // 3. required scripts
  for (const script of REQUIRED_SCRIPTS) {
    if (!scripts[script]) {
      eslintOk = false;
      if (isDryRun) console.log(`❌ ${appName}: Missing script ${script}`);
    }
  }

  // 4. eslint.config.mjs contains static-kit usage
  if (fs.existsSync(eslintConfigPath)) {
    const rawEslintConfig = fs.readFileSync(eslintConfigPath, 'utf-8');
    const content = stripJsonComments(rawEslintConfig).trim();
    if (
      content.includes("from '@ovh-ux/manager-static-analysis-kit") ||
      content.includes('from "@ovh-ux/manager-static-analysis-kit')
    ) {
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

  // 5. tsconfig.json extends static-kit base
  if (!fs.existsSync(tsconfigPath)) {
    tsOk = false;
    if (isDryRun) console.log(`❌ ${appName}: tsconfig.json missing`);
  } else {
    const tsconfig = parseJsonWithComments(tsconfigPath, appName);
    if (!tsconfig) {
      tsOk = false;
    } else {
      const baseExtends = tsconfig.extends;
      if (
        typeof baseExtends !== 'string' ||
        (!baseExtends.includes(`${STATIC_KIT_PKG}/tsconfig/react`) &&
          !baseExtends.includes(`${STATIC_KIT_PKG}/tsconfig/react-strict`))
      ) {
        tsOk = false;
        if (isDryRun) console.log(`❌ ${appName}: tsconfig extends is not compliant → ${baseExtends}`);
      }
    }
  }

  // 6. tsconfig.strict.json must exist
  if (!fs.existsSync(tsconfigStrictPath)) {
    tsOk = false;
    if (isDryRun) console.log(`❌ ${appName}: tsconfig.strict.json missing`);
  }

  return {
    eslint: eslintOk ? '✅ Done' : '📝 TODO',
    ts: tsOk ? '✅ Done' : '📝 TODO',
  };
};

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

generateStaticKitStatusReport();
