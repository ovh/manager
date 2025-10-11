#!/usr/bin/env node
import path from 'node:path';

import { EMOJIS, MUK_COMPONENTS_SRC, ODS_EXCLUDED_COMPONENTS } from '../config/muk-config.js';
import {
  buildComponentsIndexTemplate,
  buildSubcomponentPropsTemplate,
  buildSubcomponentSpecTemplate,
  buildSubcomponentTemplate,
  getComponentTemplates,
} from '../config/muk-template-config.js';
import { groupComponentsDynamically } from '../core/component-utils.js';
import {
  createFile,
  ensureDir,
  readFile,
  toKebabCase,
  toPascalCase,
  writeFile,
} from '../core/file-utils.js';
import {
  detectHasChildrenFromTarball,
  detectHasTypeExportFromIndex,
  extractOdsExportsByCategory,
} from '../core/ods-tarball-utils.js';
import { runPostUpdateChecks } from '../core/tasks-utils.js';
import { logger } from '../utils/log-manager.js';
import { checkComponents } from './check-components.js';

/**
 * Builds all necessary file and directory metadata for a given component.
 * Generates standard paths and template contents for component, props, tests, and index files.
 *
 * @param {string} componentName - The name of the ODS component (e.g. "FormField").
 * @param {boolean} [hasChildren=false] - Whether the component has nested subcomponents.
 * @returns {{
 *   componentName: string,
 *   folderName: string,
 *   paths: { base: string, tests: string },
 *   files: Record<string, { path: string, content: string }>
 * }} A metadata object describing directories and files to create.
 */
function buildComponentFiles(componentName, hasChildren = false) {
  const folderName = toKebabCase(componentName);
  const pascalName = toPascalCase(componentName);

  const componentDir = path.join(MUK_COMPONENTS_SRC, folderName);
  const testsDir = path.join(componentDir, '__tests__');
  const templates = getComponentTemplates(pascalName, hasChildren);

  return {
    componentName: pascalName,
    folderName,
    paths: { base: componentDir, tests: testsDir },
    files: {
      component: {
        path: path.join(componentDir, `${pascalName}.component.tsx`),
        content: templates.component,
      },
      props: { path: path.join(componentDir, `${pascalName}.props.ts`), content: templates.props },
      test: {
        path: path.join(testsDir, `${pascalName}.snapshot.test.tsx`),
        content: templates.test,
      },
      index: { path: path.join(componentDir, 'index.ts'), content: templates.index },
    },
  };
}

/**
 * Generates all subcomponents for a parent component, including folders, props, component, and test files.
 *
 * @async
 * @param {string} parentName - The name of the parent ODS component (e.g. "FormField").
 * @param {string} parentPascal - The parent component name in PascalCase.
 * @param {string} basePath - Path to the parent component directory.
 * @param {string[]} subcomponents - List of subcomponent names to generate.
 * @returns {Promise<void>} Resolves when all subcomponents are created.
 */
async function createSubcomponents(parentName, parentPascal, basePath, subcomponents) {
  if (!subcomponents.length) return;

  for (const subName of subcomponents) {
    const kebabSubName = toKebabCase(subName);
    const subPascal = toPascalCase(subName);

    const subDir = path.join(basePath, kebabSubName);
    const subTestsDir = path.join(subDir, '__tests__');
    ensureDir(subDir);
    ensureDir(subTestsDir);

    const hasChildren = await detectHasChildrenFromTarball(parentName, subName);
    const hasOwnType = await detectHasTypeExportFromIndex(parentName, subName);

    createFile(
      path.join(subDir, `${subPascal}.props.ts`),
      buildSubcomponentPropsTemplate(subPascal, parentPascal, hasOwnType, hasChildren),
    );
    createFile(
      path.join(subDir, `${subPascal}.component.tsx`),
      buildSubcomponentTemplate(subPascal, hasChildren),
    );
    createFile(
      path.join(subTestsDir, `${subPascal}.component.spec.tsx`),
      buildSubcomponentSpecTemplate(subPascal),
    );

    logger.info(
      `${EMOJIS.folder} Created subcomponent '${subName}' (${hasOwnType ? '🧩 own type' : '↩ parent type'}, ${hasChildren ? '👶 has children' : '🚫 stateless'})`,
    );
  }
}

/**
 * Appends external type imports and exports to a component's props file.
 *
 * @param {string} propsPath - Absolute path to the component’s props file.
 * @param {string[]} externalTypes - List of type identifiers to import/export.
 * @returns {void}
 */
function appendExternalTypesToProps(propsPath, externalTypes) {
  if (!externalTypes.length) return;

  const existing = readFile(propsPath, false);
  const alreadyPresent = externalTypes.some((type) => existing.includes(type));
  if (alreadyPresent) return;

  const typeImports = externalTypes.map((t) => `type ${t}`).join(',\n  ');
  const snippet = `
/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import {
  ${typeImports}
} from '@ovhcloud/ods-react';

export type { ${externalTypes.join(', ')} };
`;

  writeFile(propsPath, `${existing.trim()}\n${snippet}\n`);
  logger.info(`🧩 Added ${externalTypes.length} external types to props`);
}

/**
 * Creates passthroughs for hooks and constants, and appends external types.
 *
 * @async
 * @param {string} componentName - PascalCase name of the component.
 * @param {string} baseDir - Absolute path to the component directory.
 * @param {string} odsName - Original ODS package name (used for import extraction).
 * @param {string} propsPath - Path to the props file where external types may be added.
 * @returns {Promise<{ hasHooks: boolean, hasConstants: boolean }>} Whether hooks/constants were created.
 */
async function createHooksAndConstants(componentName, baseDir, odsName, propsPath) {
  const { hooks, constants, externalTypes } = await extractOdsExportsByCategory(odsName);

  // 🪝 Hooks passthrough
  if (hooks.length) {
    const hooksDir = path.join(baseDir, 'hooks');
    ensureDir(hooksDir);

    const hookFile = path.join(hooksDir, `use${componentName}.ts`);
    const hookImports = hooks.map((h) => (h.startsWith('use') ? h : `type ${h}`)).join(', ');
    const hookContent = `import { ${hookImports} } from '@ovhcloud/ods-react';

export { ${hooks.join(', ')} };
`;
    createFile(hookFile, hookContent);
    logger.info(`🪝 Created hook passthrough for ${componentName} (${hooks.length} identifiers)`);
  }

  // ⚙️ Constants passthrough
  if (constants.length) {
    const constantsDir = path.join(baseDir, 'constants');
    ensureDir(constantsDir);

    const constFile = path.join(constantsDir, `${componentName}Constants.ts`);
    const constContent = `import {
  ${constants.join(',\n  ')}
} from '@ovhcloud/ods-react';

export {
  ${constants.join(',\n  ')}
};
`;
    createFile(constFile, constContent);
    logger.info(
      `⚙️ Created constants passthrough for ${componentName} (${constants.length} identifiers)`,
    );
  }

  // 🧩 External types passthrough
  appendExternalTypesToProps(propsPath, externalTypes);

  return { hasHooks: hooks.length > 0, hasConstants: constants.length > 0 };
}

/**
 * Updates the component’s index.ts to export subcomponents, hooks, and constants.
 *
 * @param {{
 *   indexPath: string,
 *   subcomponents: string[],
 *   hasHooks: boolean,
 *   hasConstants: boolean,
 *   componentName: string
 * }} params - Configuration for index file updates.
 * @returns {void}
 */
function updateComponentIndex({ indexPath, subcomponents, hasHooks, hasConstants, componentName }) {
  let content = readFile(indexPath, false).trimEnd();
  const additions = [];

  for (const sub of subcomponents) {
    const subPascal = toPascalCase(sub);
    additions.push(`export { ${subPascal} } from './${toKebabCase(sub)}/${subPascal}.component';`);
  }

  if (hasHooks) additions.push(`export * from './hooks/use${componentName}';`);
  if (hasConstants) additions.push(`export * from './constants/${componentName}Constants';`);

  if (additions.length) {
    writeFile(indexPath, `${content}\n\n${additions.join('\n')}\n`);
    logger.info(`🔗 Updated index.ts with ${additions.length} new exports`);
  }
}

/**
 * Generates the full directory and file structure for a component and its subcomponents.
 *
 * @async
 * @param {string} parentName - The main ODS component name.
 * @param {string[]} [subcomponents=[]] - Optional list of subcomponents to generate.
 * @returns {Promise<void>}
 */
async function generateComponentStructure(parentName, subcomponents = []) {
  const hasChildren = await detectHasChildrenFromTarball(parentName);

  // 🛑 Skip abstract or invalid components that have neither source nor subcomponents
  if (hasChildren === null && !subcomponents.length) {
    logger.warn(`⚠ Skipping '${parentName}' — not a valid ODS component.`);
    return;
  }

  const { componentName, paths, files } = buildComponentFiles(parentName, hasChildren);

  Object.values(paths).forEach(ensureDir);
  Object.values(files).forEach(({ path: p, content }) => createFile(p, content));

  await createSubcomponents(parentName, componentName, paths.base, subcomponents);

  const { hasHooks, hasConstants } = await createHooksAndConstants(
    componentName,
    paths.base,
    parentName,
    files.props.path,
  );

  updateComponentIndex({
    indexPath: files.index.path,
    subcomponents,
    hasHooks,
    hasConstants,
    componentName,
  });

  logger.success(`✔ Component structure ready for ${componentName}`);
}

/**
 * Detects missing ODS components and generates their folder structures in Manager UI Kit.
 *
 * @async
 * @returns {Promise<string[]>} List of parent components that were created.
 */
async function createComponentsStructure() {
  logger.info(`${EMOJIS.info} Starting ODS → Manager UI Kit component sync...`);

  const { missingComponents = [] } = await checkComponents({ returnOnly: true });
  const relevant = missingComponents.filter((name) => !ODS_EXCLUDED_COMPONENTS.includes(name));
  // .filter((name) => ['form-field', 'range'].some((k) => name.includes(k)));

  if (!relevant.length) {
    logger.success('✅ All relevant ODS components are already present.');
    return [];
  }

  const grouped = await groupComponentsDynamically(relevant);
  const created = [];

  for (const [parent, children] of Object.entries(grouped)) {
    await generateComponentStructure(parent, children);
    created.push(parent);
  }

  logger.success(`🎉 Created folder structure for ${created.length} components.`);
  return created;
}

/**
 * Updates the root Manager UI Kit index.ts to include newly created components.
 *
 * @param {string[]} newComponents - List of component names to export.
 * @returns {void}
 */
function updateComponentsIndexExports(newComponents) {
  if (!newComponents?.length) return;

  const indexPath = path.join(MUK_COMPONENTS_SRC, 'index.ts');
  let content = readFile(indexPath, false);
  if (!content.trim()) content = buildComponentsIndexTemplate();

  const additions = [];

  for (const name of newComponents) {
    const folder = toKebabCase(name);
    const line = `export * from './${folder}';`;
    if (!content.includes(line)) additions.push(line);
  }

  if (additions.length) {
    writeFile(indexPath, `${content.trimEnd()}\n${additions.join('\n')}\n`);
    logger.success(
      `${EMOJIS.check} Added ${additions.length} new export${additions.length > 1 ? 's' : ''}`,
    );
  } else {
    logger.info(`${EMOJIS.info} No new exports required in index.ts`);
  }
}

/**
 * CLI entrypoint — synchronizes and scaffolds missing ODS components.
 *
 * Public command — updateComponents
 * - Step 1: Create missing component structures
 * - Step 2: Populate base templates
 * - Step 3: Update UI Kit index exports
 * - Step 4: Run validation tasks
 *
 * @async
 * @returns {Promise<void>}
 */
export async function addComponents() {
  logger.info(`${EMOJIS.info} Running component synchronization pipeline...`);

  // Create missing component structures
  // Populate base templates
  const created = await createComponentsStructure();

  if (!created.length) {
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
