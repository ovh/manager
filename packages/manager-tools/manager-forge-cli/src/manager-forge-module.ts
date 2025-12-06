import fs from 'node:fs';
import path from 'node:path';

import { logger } from '@ovh-ux/manager-cli-core/logger';

import { MANAGER_MODULES_DIR, MODULE_TEMPLATE_DIR } from '@/configs/manager-forge-path-config.js';
import { updateIgnoreFiles } from '@/helpers/manager-forge-generation-helper.js';
import { addModuleToWorkspace } from '@/helpers/manager-forge-tasks-helper.js';
import {
  applyTemplateReplacements,
  copyTemplate,
  ensureDirectory,
  selectTemplateFile,
} from '@/helpers/manager-forge-template-helper.js';
import type { Answers } from '@/types/PromptType.js';

/**
 * Generates a new Manager Forge module using templates,
 * applies replacements, and configures metadata files.
 *
 * @param {Answers} answers - The module metadata from prompts.
 */
function forgeModule(answers: Answers): void {
  const moduleDir = path.join(MANAGER_MODULES_DIR, answers.moduleName ?? '');

  // ────────────────────────────────────────────────────────────
  // 1. Prevent overwriting an existing module
  // ────────────────────────────────────────────────────────────
  if (fs.existsSync(moduleDir)) {
    logger.error(`❌ Module "${answers.moduleName}" already exists at: ${moduleDir}`);
    process.exit(1);
  }

  // ────────────────────────────────────────────────────────────
  // 2. Create module directory
  // ────────────────────────────────────────────────────────────
  logger.log(`🔨 Creating module at ${moduleDir}`);
  ensureDirectory(moduleDir);

  // ────────────────────────────────────────────────────────────
  // 3. Copy module template files
  // ────────────────────────────────────────────────────────────
  logger.log('📦 Copying module template...');
  copyTemplate(MODULE_TEMPLATE_DIR, moduleDir);

  // ────────────────────────────────────────────────────────────
  // 4. Select correct variants files based on module type
  // ────────────────────────────────────────────────────────────
  logger.log(`🧭 Selecting correct variants for module type: ${answers.moduleType}`);
  selectTemplateFile({
    targetDir: moduleDir,
    templatePattern: 'package-{variant}.json',
    variants: ['react', 'node'],
    selected: answers.moduleType!,
    finalName: 'package.json',
  });
  selectTemplateFile({
    targetDir: moduleDir,
    templatePattern: 'eslint-{variant}.config.mjs',
    variants: ['react', 'node'],
    selected: answers.moduleType!,
    finalName: 'eslint.config.mjs',
  });

  // ────────────────────────────────────────────────────────────
  // 5. Apply replacements
  // ────────────────────────────────────────────────────────────
  logger.log('🧩 Applying module template replacements...');

  const templateFiles = [
    path.join(moduleDir, 'package.json'),
    path.join(moduleDir, 'README.md'),
    path.join(moduleDir, 'tsconfig.json'),
    path.join(moduleDir, 'src/__tests__/lib.spec.ts'),
  ].filter(Boolean);

  applyTemplateReplacements(templateFiles, {
    moduleNameKebab: answers.moduleName ?? '',
    modulePackageName: answers.modulePackageName ?? '',
    moduleDescription: answers.moduleDescription ?? '',
    moduleRepositoryUrl: `packages/manager/modules/${answers.moduleName}`,
    isPrivate: answers.isPrivate ? 'true' : 'false',
    moduleType: answers.moduleType ?? '',
  });

  // ────────────────────────────────────────────────────────────
  // 5. Update ignore files (ESLint / Prettier / Stylelint)
  // ────────────────────────────────────────────────────────────
  logger.log('📝 Updating workspace ignore files...');
  updateIgnoreFiles('module', answers.moduleName!);

  // ────────────────────────────────────────────────────────────
  // 6.  Finalize + register the module inside the workspace
  // ────────────────────────────────────────────────────────────
  logger.log(`\n✅ Successfully forged module "${answers.moduleName}"\n`);
  addModuleToWorkspace(answers.moduleName!, answers.isPrivate!);
}

/**
 * CLI entry wrapper for module generation.
 *
 * @param {Answers} answers
 */
export function forgeModuleCli(answers: Answers): void {
  forgeModule(answers);
}
