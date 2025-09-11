#!/usr/bin/env node
/**
 * @file Patch VSCode settings.json to enable ESLint Flat Config integration
 * with the Static Analysis Kit in an app-specific, non-intrusive way.
 *
 * This script is internally invoked by the CLI (`manager-cli ide-config patch`)
 * and writes updated config files under `.ide-config/vscode/`.
 *
 * It avoids modifying developer-specific `.vscode` settings.
 * Not intended for standalone execution.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Application name to configure
const appName = process.argv[2];

// Whether to skip writing to disk and only show output
const isDryRun = process.argv.includes('--dry-run');

if (!appName) {
  console.error(
    '❌ Missing <appName> argument. This script must be called with --app from the parent CLI.',
  );
  process.exit(1);
}

// Path to the monorepo root
const workspaceRootPath = path.resolve(__dirname, '../../../../../..');

// Path to the input .vscode/settings.json
const vscodeInputPath = path.join(workspaceRootPath, '.vscode/settings.json');

// Path to the output .ide-config/vscode/settings.json
const vscodeOutputPath = path.join(workspaceRootPath, '.ide-config/vscode/settings.json');

// Ensure output directory exists
if (!isDryRun) {
  mkdirSync(path.dirname(vscodeOutputPath), { recursive: true });
}

/**
 * Adds a working directory pattern to the ESLint config if it's not already included.
 *
 * @param {object[]} workingDirs - The existing array of working directory entries
 * @param {string} pattern - The relative path to add
 */
const addWorkingDir = (workingDirs, pattern) => {
  const exists = workingDirs.some((entry) => entry?.pattern === pattern);
  if (!exists) {
    workingDirs.push({
      pattern,
      mode: 'location',
      changeProcessCWD: true,
    });
  }
};

/**
 * Reads and patches the VSCode settings.json file to enable:
 * - Flat ESLint config validation
 * - Static Analysis Kit integration
 * - App-specific working directory awareness
 * - Prettier override suppression
 *
 * The output is written to `.ide-config` instead of `.vscode` to avoid
 * interfering with developer-customized settings.
 *
 * @returns {Promise<void>}
 */
const patchVSCodeSettings = async () => {
  let settings = {};

  if (existsSync(vscodeInputPath)) {
    try {
      const raw = readFileSync(vscodeInputPath, 'utf-8');
      if (raw.trim().length > 0) {
        settings = JSON.parse(raw);
      } else {
        console.warn('⚠️ VSCode settings file is empty, starting with fresh config.');
      }
    } catch {
      console.warn('⚠️ Failed to parse existing VSCode settings, starting fresh.');
    }
  }

  settings['eslint.useFlatConfig'] = true;
  settings['eslint.validate'] = ['javascript', 'typescript', 'typescriptreact'];
  settings['eslint.nodePath'] =
    './packages/manager-tools/manager-static-analysis-kit/node_modules/eslint';

  settings['eslint.workingDirectories'] ||= [];
  addWorkingDir(settings['eslint.workingDirectories'], `./packages/manager/apps/${appName}`);
  addWorkingDir(settings['eslint.workingDirectories'], './');

  settings['prettier.enable'] = false;
  settings['editor.codeActionsOnSave'] = {
    'source.fixAll': 'always',
    'source.fixAll.eslint': 'always',
  };
  settings['editor.formatOnSave'] = false;
  settings['editor.defaultFormatter'] = null;

  const updatedSettings = JSON.stringify(settings, null, 2);

  if (isDryRun) {
    console.log(`🧪 [dry-run] Would write to: ${vscodeOutputPath}`);
    console.log(updatedSettings);
  } else {
    writeFileSync(vscodeOutputPath, updatedSettings);
    console.log(`✅ VSCode settings written to: ${vscodeOutputPath}`);
  }
};

// Execute patching
(async () => {
  console.log(`🔧 Patching VSCode config for app: ${appName}\n`);
  await patchVSCodeSettings();
  console.log(
    `\n🎉 VSCode integration config ${
      isDryRun ? 'dry-run preview complete' : 'complete'
    } for ${appName}`,
  );
})();
