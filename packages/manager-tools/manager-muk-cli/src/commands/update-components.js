#!/usr/bin/env node
import path from 'node:path';

import { EMOJIS, MUK_COMPONENTS_SRC, ODS_EXCLUDED_COMPONENTS } from '../config/muk-config.js';
import {
  buildComponentsIndexTemplate,
  buildSubcomponentSpecTemplate,
  buildSubcomponentTemplate,
  getComponentTemplates,
} from '../config/muk-template-config.js';
import { groupComponentsDynamically } from '../core/component-utils.js';
import { createFile, ensureDir, readFile, toPascalCase, writeFile } from '../core/file-utils.js';
import { detectHasChildrenFromTarball } from '../core/ods-tarball-utils.js';
import { runPostUpdateChecks } from '../core/tasks-utils.js';
import { logger } from '../utils/log-manager.js';
import { checkComponents } from './check-components.js';

/**
 * Update the Manager UI Kit's `index.ts` exports safely.
 *
 * @param {string[]} newComponents - List of newly created components (PascalCase or kebab-case)
 * @returns {Promise<void>}
 */
async function updateComponentsIndexExports(newComponents) {
  if (!newComponents?.length) return;

  const indexFilePath = path.join(MUK_COMPONENTS_SRC, 'index.ts');
  let indexContent = readFile(indexFilePath, false);

  // Create base template if index file is missing or empty
  if (!indexContent.trim()) {
    indexContent = buildComponentsIndexTemplate();
  }

  const exportLinesToAdd = [];

  for (const componentName of newComponents) {
    const normalized = componentName.replace(/\s*\(.*\)$/, '');
    const folderName = normalized.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    const exportLine = `export * from './${folderName}';`;

    if (!indexContent.includes(exportLine)) {
      exportLinesToAdd.push(exportLine);
    }
  }

  if (exportLinesToAdd.length === 0) {
    logger.info(`${EMOJIS.info} No new exports required in index.ts`);
    return;
  }

  const updatedContent = `${indexContent.trimEnd()}\n${exportLinesToAdd.join('\n')}\n`;
  writeFile(indexFilePath, updatedContent);

  logger.success(
    `${EMOJIS.check} Added ${exportLinesToAdd.length} export${exportLinesToAdd.length > 1 ? 's' : ''} to index.ts`,
  );
}

/**
 * Build directory and file structure metadata for a given component.
 *
 * @param {string} componentName - kebab-case component name
 * @param {boolean} [hasChildren=false] - Whether the component has subcomponents
 * @returns {{
 *   componentName: string,
 *   folderName: string,
 *   paths: Record<string, string>,
 *   files: Record<string, { path: string, content: string }>
 * }}
 */
function buildComponentFiles(componentName, hasChildren = false) {
  const folderName = componentName.toLowerCase();
  const testFolder = '__tests__';

  const componentDir = path.join(MUK_COMPONENTS_SRC, folderName);
  const testsDir = path.join(componentDir, testFolder);
  const snapshotDir = path.join(testsDir, 'snapshot');

  const pascalName = toPascalCase(componentName);
  const templates = getComponentTemplates(pascalName, hasChildren);

  return {
    componentName: pascalName,
    folderName,
    paths: {
      base: componentDir,
      tests: testsDir,
      snapshot: snapshotDir,
    },
    files: {
      component: {
        path: path.join(componentDir, `${pascalName}.component.tsx`),
        content: templates.component,
      },
      props: {
        path: path.join(componentDir, `${pascalName}.props.ts`),
        content: templates.props,
      },
      test: {
        path: path.join(testsDir, `${pascalName}.snapshot.test.tsx`),
        content: templates.test,
      },
      index: {
        path: path.join(componentDir, 'index.ts'),
        content: templates.index,
      },
      gitkeep: {
        path: path.join(snapshotDir, '.gitkeep'),
        content: '',
      },
    },
  };
}

/**
 * Generate folder and file structure for a component and its subcomponents.
 *
 * @param {string} parent - kebab-case name of the parent component
 * @param {string[]} [children=[]] - List of subcomponent names (kebab-case)
 * @returns {Promise<void>}
 */
async function generateComponentStructure(parent, children = []) {
  const hasChildren = await detectHasChildrenFromTarball(parent);
  const { componentName, paths, files } = buildComponentFiles(parent, hasChildren);

  // 🏗 Create base directories and files
  Object.values(paths).forEach(ensureDir);
  Object.values(files).forEach(({ path: filePath, content }) => createFile(filePath, content));

  // 📁 Create subcomponents
  for (const child of children) {
    const subDir = path.join(paths.base, child);
    const subTestsDir = path.join(subDir, '__tests__');
    ensureDir(subDir);
    ensureDir(subTestsDir);

    const subPascal = toPascalCase(child);
    const subComponentContent = buildSubcomponentTemplate(subPascal, componentName);
    const subSpecContent = buildSubcomponentSpecTemplate(subPascal);

    createFile(path.join(subDir, `${subPascal}.component.tsx`), subComponentContent);
    createFile(path.join(subTestsDir, `${subPascal}.component.spec.tsx`), subSpecContent);

    logger.info(`📁 Created subcomponent '${child}' with __tests__`);
  }

  // 🔗 Add export lines to parent index.ts
  if (children.length > 0) {
    const parentIndexPath = files.index.path;
    let indexContent = readFile(parentIndexPath, false).trimEnd();

    const exportLines = children
      .map((child) => {
        const childPascal = toPascalCase(child);
        return `export { ${childPascal} } from './${child}/${childPascal}.component';`;
      })
      .join('\n');

    if (!indexContent.includes(exportLines)) {
      const updatedIndex = `${indexContent}\n\n${exportLines}\n`;
      writeFile(parentIndexPath, updatedIndex);
      logger.info(`🔗 Linked ${children.length} subcomponents in ${parent}/index.ts`);
    }
  }

  logger.success(`✔ Created base structure for ${componentName}`);
}

/**
 * Step 1 — Create missing ODS → Manager UI Kit component structures.
 *
 * @returns {Promise<string[]>} - List of created parent components
 */
async function createComponentsStructure() {
  logger.info(`${EMOJIS.info} Starting ODS → Manager UI Kit component sync...`);

  const { missingComponents = [] } = await checkComponents({ returnOnly: true });
  const componentsToCreate = missingComponents.filter((c) => !ODS_EXCLUDED_COMPONENTS.includes(c));

  if (!componentsToCreate.length) {
    logger.success('✅ All relevant ODS components are already present.');
    return [];
  }

  logger.warn(`⚠ ${componentsToCreate.length} missing components detected. Generating folders...`);

  const groupedComponents = groupComponentsDynamically(componentsToCreate);
  const createdParents = [];

  for (const [parent, children] of Object.entries(groupedComponents)) {
    await generateComponentStructure(parent, children);
    createdParents.push(parent);
  }

  logger.success(`🎉 Created folder structure for ${createdParents.length} components.`);
  return createdParents;
}

/**
 * Public command — updateComponents
 *
 * - Step 1: Create missing component structures
 * - Step 2: Populate base templates
 * - Step 3: Update UI Kit index exports
 * - Step 4: Run validation tasks
 */
export async function updateComponents() {
  logger.info(`${EMOJIS.info} Running component synchronization pipeline...`);

  // Create missing component structures
  // Populate base templates
  const created = await createComponentsStructure();

  if (created.length === 0) {
    logger.success('✅ No new components to add.');
    return;
  }

  // Update UI Kit index exports
  await updateComponentsIndexExports(created);

  // Run validation tasks (install, build, tests) after workspace updates
  runPostUpdateChecks();

  logger.success(
    `🏁 Component sync completed — ${created.length} new folder${created.length > 1 ? 's' : ''} created.`,
  );
}
