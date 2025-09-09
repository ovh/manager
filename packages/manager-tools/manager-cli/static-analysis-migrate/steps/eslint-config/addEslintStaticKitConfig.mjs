#!/usr/bin/env node
import { access, writeFile } from 'fs/promises';
import { spawn } from 'node:child_process';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { applicationsBasePath } from '../../../utils/AppUtils.mjs';
import {
  getPackageNameFromApp,
  readPackageJson,
  writePackageJson,
} from '../../../utils/DependenciesUtils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');

const applicationPath = path.resolve(applicationsBasePath, appName);
const eslintConfigPath = path.join(applicationPath, 'eslint.config.mjs');

/**
 * Runs `yarn lint:tsx` for a specific app, optionally with --fix.
 *
 * @param {string} appName - The application name (e.g., 'zimbra').
 * @param {Object} [options] - Linting options.
 * @param {boolean} [options.fix=false] - Whether to auto-fix lint issues.
 */
export const runLintTSCli = (appName, { fix = false } = {}) => {
  const pkgName = getPackageNameFromApp(appName);
  if (!pkgName) {
    console.error(`❌ Could not resolve package name for app "${appName}". Skipping lint.`);
    return;
  }

  const args = ['lint:tsx', '--', '--app', pkgName];
  if (fix) args.push('--fix');

  console.log(`\n🚦 Running lint check for "${appName}" via \`yarn ${args.join(' ')}\`\n`);

  const proc = spawn('yarn', args, {
    shell: true,
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../../../..'),
  });

  proc.on('close', (code) => {
    if (code === 0) {
      console.log(`\n✅ Lint check passed for "${appName}".`);
    } else {
      console.warn(`\n⚠ Lint check failed for "${appName}" with exit code ${code}.`);
    }
  });

  proc.on('error', (err) => {
    console.error(`❌ Failed to run lint:tsx for "${appName}": ${err.message}`);
  });
};

/**
 * Generates a prefilled eslint.config.mjs file scaffold with full options commented.
 * @returns {string}
 */
const getEslintConfigContent = () =>
  `
// Full adoption
/*import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default eslintSharedConfig;
*/

// Progressive adoption
/*import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

// import { storybookEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/storybook';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
  reactEslintConfig,
  a11yEslintConfig,
  htmlEslintConfig,
  tailwindJsxConfig,
  tanStackQueryEslintConfig,
  ...importEslintConfig,
  ...checkFileEslintConfig,
  vitestEslintConfig,
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    ...cssEslintConfig,
    files: ['**\\/*.css', '**\\/*.scss'],
  },
];*/

// Progressive and disable some rules
/* import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  {
    ...typescriptEslintConfig,
    rules: {
      ...typescriptEslintConfig.rules,
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/await-thenable': 'off'
    },
  },
];
*/

// Progressive and disable full rules
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  {
    ...typescriptEslintConfig,
    rules: {},
  },
];
`.trim();

/**
 * Adds eslint.config.mjs, lint scripts, and devDeps for static analysis kit.
 */
const addEslintStaticKitConfig = async () => {
  // 1. Create eslint.config.mjs if not exists
  try {
    await access(eslintConfigPath);
    console.warn(`⚠️  ${eslintConfigPath} already exists. Skipping creation.`);
  } catch {
    const content = getEslintConfigContent();
    if (isDryRun) {
      console.log(
        `🧪 [dry-run] Would create eslint.config.mjs with:\n\n${content.slice(0, 1000)}\n...`,
      );
    } else {
      await writeFile(eslintConfigPath, content, 'utf-8');
      console.log(`✅ Created eslint.config.mjs`);
    }
  }

  // 2. Run the build script using yarn workspace command
  console.log(
    `🛠 Running build script inside 'manager/packages/manager-tools/manager-static-analysis-kit'...`,
  );
  const buildProc = spawn('yarn', ['workspace', '@ovh-ux/manager-static-analysis-kit', 'build'], {
    shell: true,
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../../../..'), // Run from the root directory
  });

  buildProc.on('close', (code) => {
    if (code === 0) {
      console.log(`✅ Build script ran successfully inside 'static-analysis-kit'.`);
    } else {
      console.warn(`⚠ Build script failed with exit code ${code}.`);
    }
  });

  buildProc.on('error', (err) => {
    console.error(`❌ Failed to run the build script: ${err.message}`);
  });

  // 3. Update package.json
  const pkg = readPackageJson(applicationPath);
  if (!pkg) {
    console.error(`❌ Could not read package.json in ${applicationPath}`);
    process.exit(1);
  }

  pkg.scripts ||= {};
  if (!pkg.scripts['lint:modern']) {
    pkg.scripts['lint:modern'] = 'manager-lint --config eslint.config.mjs ./src';
    console.log(`➕ Added script: "lint"`);
  }
  if (!pkg.scripts['lint:modern:fix']) {
    pkg.scripts['lint:modern:fix'] = 'manager-lint --fix --config eslint.config.mjs ./src';
    console.log(`➕ Added script: "lint:fix"`);
  }

  pkg.devDependencies ||= {};
  if (!pkg.devDependencies['@ovh-ux/manager-static-analysis-kit']) {
    pkg.devDependencies['@ovh-ux/manager-static-analysis-kit'] = '*';
    console.log(`📦 Added "@ovh-ux/manager-static-analysis-kit" to devDependencies`);
  }

  if (!isDryRun) {
    writePackageJson(applicationPath, pkg);
  }

  // 4. Final suggestion
  console.log(`\n✅ ESLint static analysis setup complete for "${appName}".`);
  console.log(`📘 You can now progressively enable rules for full adoption.`);
  console.log(`📄 See: /development-guidelines/static-analysis-kit-migration/`);
};

addEslintStaticKitConfig()
  .then(() => {
    if (!isDryRun) {
      runLintTSCli(appName, { fix: true });
    }
  })
  .catch((err) => {
    console.error('❌ Script failed:', err);
    process.exit(1);
  });
