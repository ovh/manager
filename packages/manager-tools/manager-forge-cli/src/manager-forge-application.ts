import fs from 'node:fs';
import path from 'node:path';

import { APPS_DIR, TEMPLATE_DIR } from '@/configs/manager-forge-config.js';
import {
  applyTemplateReplacements,
  copyTemplate,
  ensureDirectory,
} from '@/helpers/manager-forge-template-helper.js';
import type { Answers } from '@/types/PromptType.js';
import { addAppToWorkspace } from '@/helpers/manager-forge-tasks-helper.js';

export function forgeApplication(answers: Answers): void {
  const appDir = path.join(APPS_DIR, answers.appName);

  if (fs.existsSync(appDir)) {
    console.error(`❌ Application "${answers.appName}" already exists.`);
    process.exit(1);
  }

  console.log(`🔨 Creating application at ${appDir}`);
  ensureDirectory(appDir);

  console.log('📦 Copying template files...');
  copyTemplate(TEMPLATE_DIR, appDir);

  console.log('🧩 Applying replacements...');
  applyTemplateReplacements(
    [
      path.join(appDir, 'package.json'),
      path.join(appDir, 'src/Tracking.constants.ts'),
      path.join(appDir, 'src/App.constants.ts'),
    ],
    {
      appNameKebab: answers.appName,
      packageName: answers.packageName,
      description: answers.description,
      repositoryUrl: `packages/manager/apps/${answers.appName}`,
      regions: answers.regions,
      universes: answers.universes,
      trackingLevel2: answers.level2,
      trackingUniverse: answers.universe,
      trackingSubUniverse: answers.subUniverse,
    },
  );

  console.log(`✅ Successfully forged ${answers.appName}`);

  addAppToWorkspace(answers.appName);
}
