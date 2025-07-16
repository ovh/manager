#!/usr/bin/env node

import path from 'path';
import fs from 'fs/promises';
import {
  readPackageJson,
  writePackageJson,
} from '../../../utils/DependenciesUtils.mjs';
import { applicationsBasePath } from '../../../utils/AppUtils.mjs';

const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');

const appPath = path.resolve(applicationsBasePath, appName);
const tsconfigPath = path.join(appPath, 'tsconfig.json');
const tsconfigStrictPath = path.join(appPath, 'tsconfig.strict.json');

const looseTSConfig = {
  extends: '@ovh-ux/manager-static-analysis-kit/tsconfig/react',
  compilerOptions: {
    baseUrl: '.',
    paths: {
      '@/public/*': ['./public/*'],
      '@/*': ['./src/*']
    },
    outDir: 'dist',
    allowJs: true
  },
  include: ['src', 'public/**/*.json'],
  exclude: ['node_modules', 'dist', 'types']
};

const strictTSConfig = {
  extends: '@ovh-ux/manager-static-analysis-kit/tsconfig/react-strict',
  compilerOptions: looseTSConfig.compilerOptions,
  include: looseTSConfig.include,
  exclude: looseTSConfig.exclude
};

async function addTSStaticKitConfig() {
  const pkg = readPackageJson(appPath);
  if (!pkg) {
    console.error(`❌ Could not read package.json in ${appPath}`);
    process.exit(1);
  }

  pkg.devDependencies ||= {};
  pkg.devDependencies['@ovh-ux/manager-static-analysis-kit'] = '*';

  pkg.scripts ||= {};

  if (!pkg.scripts['build:strict']) {
    const scripts = Object.entries(pkg.scripts);
    const newScripts = {};

    for (let i = 0; i < scripts.length; i++) {
      const [key, value] = scripts[i];
      newScripts[key] = value;

      // Insert build:strict right after build
      if (key === 'build') {
        newScripts['build:strict'] = 'tsc --project tsconfig.strict.json && vite build';
      }
    }

    // If no 'build' script exists, fallback to appending
    if (!newScripts['build'] && !newScripts['build:strict']) {
      newScripts['build:strict'] = 'tsc --project tsconfig.strict.json && vite build';
    }

    pkg.scripts = newScripts;
  }

  if (!isDryRun) {
    writePackageJson(appPath, pkg);
    await fs.writeFile(tsconfigPath, JSON.stringify(looseTSConfig, null, 2));
    await fs.writeFile(tsconfigStrictPath, JSON.stringify(strictTSConfig, null, 2));
  }

  console.log(`\n✅ TypeScript static kit added to "${appName}"`);
  console.log(`➕ build:strict script and tsconfig files configured.`);
  console.log(`📘 Reminder: only override app-specific fields like include/exclude/paths.`);
}

addTSStaticKitConfig().catch((err) => {
  console.error('❌ Failed to apply TypeScript static kit:', err);
  process.exit(1);
});
