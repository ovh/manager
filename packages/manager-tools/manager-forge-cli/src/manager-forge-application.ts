import fs from 'node:fs';
import path from 'node:path';

import { logger } from '@ovh-ux/manager-cli-core/logger';

import {
  APPLICATION_TEMPLATE_DIR,
  MANAGER_APPLICATIONS_DIR,
} from '@/configs/manager-forge-path-config.js';
import { updateIgnoreFiles } from '@/helpers/manager-forge-generation-helper.js';
import { addAppToWorkspace } from '@/helpers/manager-forge-tasks-helper.js';
import {
  applyTemplateReplacements,
  copyTemplate,
  ensureDirectory,
} from '@/helpers/manager-forge-template-helper.js';
import type { Answers } from '@/types/PromptType.js';

/**
 * Generates a new full forge application using templates,
 * applies variable replacements, and registers the app inside the workspace.
 *
 * @param {Answers} answers - The user-provided application metadata.
 */
function forgeApplication(answers: Answers): void {
  const applicationDirectory = path.join(MANAGER_APPLICATIONS_DIR, answers.appName);

  // ────────────────────────────────────────────────────────────
  // 1. Prevent overwriting an existing application
  // ────────────────────────────────────────────────────────────
  if (fs.existsSync(applicationDirectory)) {
    logger.error(`❌ Application "${answers.appName}" already exists at: ${applicationDirectory}`);
    process.exit(1);
  }

  // ────────────────────────────────────────────────────────────
  // 2. Create application directory
  // ────────────────────────────────────────────────────────────
  logger.log(`🔨 Creating application at ${applicationDirectory}`);
  ensureDirectory(applicationDirectory);

  // ────────────────────────────────────────────────────────────
  // 3. Copy base template into the new application directory
  // ────────────────────────────────────────────────────────────
  logger.log('📦 Copying template files...');
  copyTemplate(APPLICATION_TEMPLATE_DIR, applicationDirectory);

  // ────────────────────────────────────────────────────────────
  // 4. Apply replacements to template files
  // ────────────────────────────────────────────────────────────
  logger.log('🧩 Applying replacements...');

  applyTemplateReplacements(
    [
      path.join(applicationDirectory, 'package.json'),
      path.join(applicationDirectory, 'README.md'),
      path.join(applicationDirectory, 'src/Tracking.constants.ts'),
      path.join(applicationDirectory, 'src/App.constants.ts'),
    ],
    {
      appNameKebab: answers.appName,
      appPackageName: answers.packageName,
      appDescription: answers.description,
      appRepositoryUrl: `packages/manager/apps/${answers.appName}`,
      regions: answers.regions,
      universes: answers.universes,
      trackingLevel2: answers.level2,
      trackingUniverse: answers.universe,
      trackingSubUniverse: answers.subUniverse,
    },
  );

  // ────────────────────────────────────────────────────────────
  // 5. Update ignore files (ESLint / Prettier / Stylelint)
  // ────────────────────────────────────────────────────────────
  logger.log('📝 Updating workspace ignore files...');
  updateIgnoreFiles('app', answers.appName);

  // ────────────────────────────────────────────────────────────
  // 6. Finalize + register the app inside the workspace
  // ────────────────────────────────────────────────────────────
  logger.log(`\n✅ Successfully forged application "${answers.appName}"\n`);
  addAppToWorkspace(answers.appName);
}

/**
 * CLI entrypoint wrapper for generating a full application.
 * Delegates execution to the generic CLI runner so the UX
 * is consistent with all forge commands (banner, spinner, errors).
 *
 * @param {Answers} answers - Application metadata collected from prompts.
 * @returns {Promise<void>}
 */
export function forgeApplicationCli(answers: Answers): void {
  forgeApplication(answers); // no banner, no spinner here!
}
