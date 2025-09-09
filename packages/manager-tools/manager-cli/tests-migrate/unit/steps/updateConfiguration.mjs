import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import * as t from '@babel/types';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import prettier from 'prettier';

import { defaultExcludedFiles } from '@ovh-ux/manager-tests-setup';

const traverse = traverseModule.default;

/**
 * Rewrites vitest.config.js to use sharedConfig + app-specific overrides
 * @param {string} appPath - Absolute path to the app folder
 * @param {boolean} dryRun - Whether to simulate changes only
 */
export const updateConfiguration = async (appPath, dryRun = false) => {
  const appName = path.basename(appPath);
  const configPath = path.join(appPath, 'vitest.config.js');

  if (!existsSync(configPath)) {
    console.warn(`⚠️ No vitest.config.js found in ${configPath}`);
    return;
  }

  console.log(`🧠 Rewriting vitest.config.js for: ${appName}`);

  const rawCode = readFileSync(configPath, 'utf-8');
  const ast = parse(rawCode, {
    sourceType: 'module',
    plugins: ['typescript'],
  });

  let setupFiles = null;
  let coverageExclude = [];
  let testExtras = {};
  let aliases = {};

  traverse(ast, {
    ObjectExpression(path) {
      const isDefineConfig =
        path.parentPath?.parentPath?.isExportDefaultDeclaration?.() ||
        path.parentPath?.isExportDefaultDeclaration?.();

      if (!isDefineConfig) return;

      for (const prop of path.node.properties) {
        if (!t.isObjectProperty(prop)) continue;

        const key = prop.key.name || prop.key.value;

        if (key === 'test' && t.isObjectExpression(prop.value)) {
          for (const testProp of prop.value.properties) {
            if (!t.isObjectProperty(testProp)) continue;

            const name = testProp.key.name || testProp.key.value;

            if (name === 'setupFiles') {
              setupFiles = testProp.value?.elements?.map?.((e) => e.value) || testProp.value?.value;
            } else if (name === 'coverage') {
              for (const c of testProp.value.properties) {
                if (
                  t.isObjectProperty(c) &&
                  (c.key.name === 'exclude' || c.key.value === 'exclude') &&
                  t.isArrayExpression(c.value)
                ) {
                  coverageExclude = c.value.elements
                    .filter((e) => t.isStringLiteral(e))
                    .map((e) => e.value);
                }
              }
            } else {
              testExtras[name] = testProp.value.value;
            }
          }
        }

        if (key === 'resolve' && t.isObjectExpression(prop.value)) {
          for (const rProp of prop.value.properties) {
            if (
              t.isObjectProperty(rProp) &&
              (rProp.key.name === 'alias' || rProp.key.value === 'alias') &&
              t.isObjectExpression(rProp.value)
            ) {
              for (const aliasProp of rProp.value.properties) {
                if (
                  t.isObjectProperty(aliasProp) &&
                  t.isStringLiteral(aliasProp.key) &&
                  t.isCallExpression(aliasProp.value)
                ) {
                  const key = aliasProp.key.value;
                  const resolvedPath = aliasProp.value.arguments[1]?.value;
                  if (key && resolvedPath) {
                    aliases[key] = resolvedPath;
                  }
                }
              }
            }
          }
        }
      }
    },
  });

  coverageExclude = coverageExclude.filter((value) => !defaultExcludedFiles.includes(value));

  const lines = [
    `import path from 'path';`,
    `import { sharedConfig, mergeConfig, createConfig, defaultExcludedFiles } from '@ovh-ux/manager-tests-setup';`,
    ``,
    `export default mergeConfig(`,
    `  sharedConfig,`,
    `  createConfig({`,
    `    test: {`,
    ...(setupFiles ? [`      setupFiles: ${JSON.stringify(setupFiles)},`] : []),
    `      coverage: {`,
    `        exclude: [`,
    `          ...defaultExcludedFiles,`,
    ...(coverageExclude.length > 0
      ? [
          `          // App-specific exclusions (not in shared config):`,
          ...coverageExclude.map((e) => `          ${JSON.stringify(e)},`),
        ]
      : []),
    `        ],`,
    `      },`,
    `    },`,
    `    resolve: {`,
    `      alias: {`,
    ...Object.entries(aliases).map(
      ([key, value]) =>
        `        ${JSON.stringify(key)}: path.resolve(__dirname, ${JSON.stringify(value)}),`,
    ),
    `      },`,
    `    },`,
    `  }),`,
    `);`,
  ];

  const rawOutput = lines.join('\n');
  const formatted = await prettier.format(rawOutput, { parser: 'babel' });

  if (dryRun) {
    console.log(`🧪 [dry-run] Would rewrite vitest.config.js:\n\n${formatted}`);
  } else {
    writeFileSync(configPath, formatted, 'utf-8');
    console.log(`✅ Rewrote vitest.config.js at ${configPath}`);
  }
};
