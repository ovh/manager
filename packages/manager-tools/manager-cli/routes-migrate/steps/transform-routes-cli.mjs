#!/usr/bin/env node
import parser from '@babel/parser';
import traverseModule from '@babel/traverse';
import { readFile, writeFile } from 'fs/promises';
import prettier from 'prettier';

import { traverseRoutesExportNodes } from '../../utils/ASTUtils.mjs';
import { resolveRoutePath } from '../../utils/AppUtils.mjs';
import {
  buildUniqueComponentName,
  extractPreservedBlocks,
  injectNamedImport,
  isCodeFileExists,
  splitImportsAndBody,
} from '../../utils/CodeTransformUtils.mjs';

const traverse = traverseModule.default;

const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');
const NOT_FOUND_ROUTE = '@/pages/404';

/**
 * Resolve all possible applications routes path
 * @type {string|null}
 */
const applicationRoutePath = resolveRoutePath(appName, { verbose: isDryRun });

/**
 * Find routes export start line
 * @param lines
 * @returns {*}
 */
const findRoutesExportStartLine = (lines) =>
  lines.findIndex(
    (line) =>
      line.includes('export const Routes') ||
      line.includes('export const routes') ||
      line.includes('const Routes') ||
      line.includes('const routes') ||
      line.includes('export default ['),
  );

/**
 * Removes the lazyRouteConfig block from the source code if present.
 * This helps avoid spreading unresolved lazy configuration in output.
 * @param {string} code - The source code to clean.
 * @returns {string} - The cleaned source code.
 */
const removeLazyRouteConfig = (code) => {
  const lazyRoutePatterns = [/^const lazyRouteConfig[\s\S]*?\n};\n/im];
  let cleaned = code;

  lazyRoutePatterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '');
  });

  return cleaned.trim();
};

/**
 * Recursively removes layout route wrappers with empty paths and `LayoutPage` components.
 * @param {string} input - The JSX route string.
 * @returns {string} - The simplified route string without nested layout wrappers.
 */
const removeNestedLayoutWrappers = (input) => {
  const layoutWrapperRegex =
    /<Route\s+path=\{['"]{2}['"]\}\s+Component=\{LayoutPage\}>([\s\S]*?)<\/Route>/g;

  let output = input;
  let prev;
  do {
    prev = output;
    output = output.replace(layoutWrapperRegex, (_, inner) => inner.trim());
  } while (output !== prev);

  return output;
};

/**
 * Extracts metadata (id, breadcrumb label, pageName) from a route AST node.
 * @param {Object} node - Babel ObjectExpression representing a route.
 * @returns {{ id: string, breadcrumb: string, pageName: string }} - Extracted metadata.
 */
const extractRouteMetadata = (node) => {
  const metadata = { id: '', breadcrumb: '', pageName: '' };
  if (!node || node.type !== 'ObjectExpression') return metadata;

  for (const prop of node.properties) {
    if (prop.type === 'ObjectProperty') {
      const key = prop.key.name || prop.key.value;

      if (key === 'id' && prop.value.type === 'StringLiteral') {
        metadata.id = prop.value.value;
      }

      if (key === 'handle' && prop.value.type === 'ObjectExpression') {
        for (const handleProp of prop.value.properties) {
          const handleKey = handleProp.key.name || handleProp.key.value;

          if (handleKey === 'breadcrumb') {
            const labelProp = handleProp.value.properties?.find(
              (p) => (p.key.name || p.key.value) === 'label',
            );
            if (labelProp?.value?.type === 'StringLiteral') {
              metadata.breadcrumb = labelProp.value.value;
            }
          }

          if (handleKey === 'tracking') {
            const pageNameProp = handleProp.value.properties?.find(
              (p) => (p.key.name || p.key.value) === 'pageName',
            );
            if (pageNameProp?.value?.type === 'StringLiteral') {
              metadata.pageName = pageNameProp.value.value;
            }
          }
        }
      }
    }
  }

  return metadata;
};

/**
 * Recursively builds a JSX <Route> tree from a route ObjectExpression.
 * @param {Object} node - Babel ObjectExpression node.
 * @param {string} code - The original source code.
 * @param {number} depth - Current depth for indentation.
 * @param {Map<string, string>} importsMap - Mapping of import paths to component names.
 * @param {boolean} isRoot - Whether this node is the root of the route tree.
 * @returns {string} - JSX string representing this route node.
 */
const buildRouteComponent = (node, code, depth = 2, importsMap, isRoot = false) => {
  if (!node || node.type !== 'ObjectExpression') {
    console.warn('⚠️ Skipping invalid route node:', node?.type);
    return '';
  }

  const indent = ' '.repeat(depth);
  const props = {};
  let children = [];

  for (const prop of node.properties || []) {
    if (!prop) continue;

    if (prop.type === 'SpreadElement') {
      const spreadArg = prop.argument;

      try {
        if (
          spreadArg?.type === 'CallExpression' &&
          spreadArg.callee.name === 'lazyRouteConfig' &&
          spreadArg.arguments.length === 1
        ) {
          const arg = spreadArg.arguments[0];
          const importCall = arg?.body;

          if (
            arg?.type === 'ArrowFunctionExpression' &&
            importCall?.type === 'CallExpression' &&
            importCall.callee.type === 'Import'
          ) {
            const importPath = importCall.arguments?.[0]?.value;
            if (!importPath || typeof importPath !== 'string') {
              throw new Error('Invalid dynamic import path');
            }

            const metadata = extractRouteMetadata(node);
            const componentName = buildUniqueComponentName(importPath, metadata);
            importsMap.set(importPath, componentName);
            props.Component = componentName;
          }
        }
      } catch (err) {
        console.warn(`⚠️ Failed to parse lazyRouteConfig at depth ${depth}: ${err.message}`);
      }
    } else if (prop.type === 'ObjectProperty') {
      const key = prop.key?.name || prop.key?.value;
      if (!key) continue;

      if (key === 'children' && prop.value?.type === 'ArrayExpression') {
        children = (prop.value.elements || [])
          .map((child) => buildRouteComponent(child, code, depth + 1, importsMap))
          .filter(Boolean);
      } else if (typeof prop.value?.start === 'number' && typeof prop.value?.end === 'number') {
        props[key] = code.slice(prop.value.start, prop.value.end);
      } else {
        console.warn(`⚠️ Missing start/end for property "${key}", skipping`);
      }
    }
  }

  if (isRoot) {
    props.id = '"root"';
    props.errorElement = `<ErrorBoundary redirectionApp="${appName}-backup" isPreloaderHide={true} isRouteShellSync={true} />`;

    const hasNotFound = children.some(
      (child) => child.includes("path={'*'}") && child.includes('element={<NotFound />}'),
    );
    if (!hasNotFound) {
      children.push(`${indent}  <Route path={'*'} element={<NotFound />} />`);
    }
  }

  const propString = Object.entries(props)
    .map(([k, v]) => `${k}={${v}}`)
    .join(' ');

  return children.length
    ? `${indent}<Route ${propString}>\n${children.join('\n')}\n${indent}</Route>`
    : `${indent}<Route ${propString} />`;
};

/**
 * Traverses the AST to extract and convert route exports into JSX route components.
 * @param {Object} ast - The parsed Babel AST.
 * @param {string} code - Original source code.
 * @param {Map<string, string>} lazyRoutesNames - Mapping to track lazy-loaded component imports.
 * @returns {string[]} - Array containing the JSX route tree.
 */
const extractRoutesFromAST = (ast, code, lazyRoutesNames) => {
  let jsxRoutes = [];

  try {
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        if (node?.source?.value === NOT_FOUND_ROUTE) {
          lazyRoutesNames.set(NOT_FOUND_ROUTE, 'NotFound');
        }
      },
    });

    traverseRoutesExportNodes(ast, {
      onArrayExpression: (arrayNode) => {
        if (!arrayNode?.elements?.length) {
          console.warn('⚠️ Skipping empty or invalid route export array.');
          return;
        }

        const result = buildRouteComponent(arrayNode.elements[0], code, 2, lazyRoutesNames, true);
        if (result) jsxRoutes = [result];
      },
    });
  } catch (err) {
    console.error('❌ Error during AST traversal:', err.message);
  }

  return jsxRoutes;
};

/**
 * Generates React.lazy import statements for each dynamic route component.
 * @param {Map<string, string>} lazyRoutesNames - Map of import paths to component names.
 * @returns {string} - Joined string of lazy import statements.
 */
const generateLazyRouteImports = (lazyRoutesNames) =>
  Array.from(lazyRoutesNames.entries())
    .filter(([_, name]) => !name.includes('NotFound'))
    .map(([path, name]) => `const ${name} = React.lazy(() => import('${path}'));`)
    .join('\n');

/**
 * Parses the code, extracts route exports, transforms them into JSX routes, and prepares import blocks.
 * @param {string} code - Source code to transform.
 * @returns {{ routesPreservedBlocks: string, routesTransformedBlock: string, lazyRoutesBlock: string }} - All parts needed to generate the final file.
 */
const generateTransformedRoutes = (code) => {
  const { importBlocks, body } = splitImportsAndBody(code, {
    findImportsEndLine: findRoutesExportStartLine,
    excludedImports: ['ErrorBoundary', '@ovh-ux/manager-react-components'],
    requiredImports: ["import React from 'react';"],
  });

  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });
  } catch (err) {
    console.error('❌ Failed to parse input code into AST:', err.message);
    return {
      routesPreservedBlocks: '',
      routesTransformedBlock: '',
      lazyRoutesBlock: '',
    };
  }

  const lazyRoutesNames = new Map();
  const jsxRoutes = extractRoutesFromAST(ast, code, lazyRoutesNames);

  return {
    routesPreservedBlocks: extractPreservedBlocks({
      imports: injectNamedImport(importBlocks, { from: 'react-router-dom', name: 'Route' }),
      requiredImports: ["import { ErrorBoundary } from '@ovh-ux/manager-react-components';"],
      excludedModules: ['@ovh-ux/manager-react-components', 'ErrorBoundary'],
      extraLines: body?.join?.('\n')?.split?.('\n\r'),
    }),
    routesTransformedBlock: removeNestedLayoutWrappers(jsxRoutes.join('\n')),
    lazyRoutesBlock: generateLazyRouteImports(lazyRoutesNames),
  };
};

/**
 * Main entry function. Validates input, transforms the route config, formats the result, and writes output.
 * Supports `--dry-run` to print the output instead of writing to disk.
 * @returns {Promise<void>}
 */
const transformRoutesToJsx = async () => {
  if (!(await isCodeFileExists(applicationRoutePath))) {
    console.error(`❌ Error: routes.tsx file not found at ${applicationRoutePath}`);
    process.exit(1);
  }

  const actualSourceCode = await readFile(applicationRoutePath, 'utf-8');
  const { routesTransformedBlock, lazyRoutesBlock, routesPreservedBlocks } =
    generateTransformedRoutes(removeLazyRouteConfig(actualSourceCode));

  if (!routesTransformedBlock.length) {
    console.warn('⚠️ Warning: No JSX routes generated.');
    return;
  }

  const output = `${routesPreservedBlocks}

${lazyRoutesBlock}

export default (
${routesTransformedBlock}
);`;

  const formatted = await prettier.format(output, {
    parser: 'babel-ts',
    singleQuote: true,
    trailingComma: 'all',
    semi: true,
    printWidth: 100,
    arrowParens: 'always',
    endOfLine: 'lf',
  });

  if (isDryRun) {
    console.log('ℹ️  Dry run output:');
    console.log(formatted);
  } else {
    await writeFile(applicationRoutePath, formatted);
    console.log(`✅ Successfully written JSX tree to ${applicationRoutePath}`);
  }
};

transformRoutesToJsx().catch((err) => console.error('❌ Unexpected error:', err));
