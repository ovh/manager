import fs from 'fs';
import path from 'path';
import babelTraverse from '@babel/traverse';
import babelGenerator from '@babel/generator';
import parser from '@babel/parser';
import prettier from 'prettier';
import * as t from '@babel/types';
import { fileURLToPath } from 'url';

const traverse = babelTraverse.default;
const generator = babelGenerator.default;

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

const [inputFilePath, outputFilePath] = process.argv.slice(2);

/**
 * Creates the JSX tree for routes
 * @param {Array} routesElements - The route elements
 * @param {Function} buildRouteJSX - Function to build the JSX for a route
 * @returns {Object} - The JSX tree of routes
 */
const createRoutesJSXTree = (routesElements, buildRouteJSX) =>
  t.jsxElement(
    t.jsxOpeningElement(t.jsxIdentifier('Routes'), [], false),
    t.jsxClosingElement(t.jsxIdentifier('Routes')),
    [...routesElements.filter(t.isObjectExpression).map(buildRouteJSX)],
    false,
  );

/**
 * Adds required imports for routes
 * @param {Object} ast - The abstract syntax tree
 */
const addRequiredImports = (ast) => {
  const hasRouterImport = ast.program.body.some(
    (node) =>
      t.isImportDeclaration(node) && node.source.value === 'react-router-dom',
  );

  if (!hasRouterImport) {
    const routeImport = t.importDeclaration(
      [
        t.importSpecifier(t.identifier('Route'), t.identifier('Route')),
        t.importSpecifier(t.identifier('Routes'), t.identifier('Routes')),
      ],
      t.stringLiteral('react-router-dom'),
    );
    ast.program.body.unshift(routeImport);
  }
};

/**
 * Sorts imports in a specific order
 * @param {string} formattedOutput - The formatted code
 * @returns {string} - The code with sorted imports
 */
const sortImports = (formattedOutput) => {
  const lines = formattedOutput.split('\n');
  const imports = [];
  const otherLines = [];
  let isImportBlock = false;

  lines.forEach((line) => {
    if (line.startsWith('import ')) {
      isImportBlock = true;
      imports.push(line);
    } else if (isImportBlock && line.trim() === '') {
      isImportBlock = false;
      otherLines.push(line);
    } else {
      otherLines.push(line);
    }
  });

  // Sort imports
  const sortedImports = imports.sort((a, b) => {
    // React first
    if (a.includes("from 'react'")) return -1;
    if (b.includes("from 'react'")) return 1;

    // react-router-dom second
    if (a.includes("from 'react-router-dom'")) return -1;
    if (b.includes("from 'react-router-dom'")) return 1;

    // Other imports alphabetically
    return a.localeCompare(b);
  });

  // Rebuild the file with sorted imports
  return [...sortedImports, '', ...otherLines].join('\n');
};

/**
 * Builds the JSX for a route
 * @param {Object} objExpr - The route object expression
 * @returns {Object} - The route JSX element
 */
const buildRouteJSX = (objExpr) => {
  const attributes = [];
  let children = [];

  objExpr.properties.forEach((prop) => {
    if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) {
      return;
    }

    const key = prop.key.name;

    if (key === 'id' && t.isStringLiteral(prop.value)) {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('id'),
          t.stringLiteral(prop.value.value),
        ),
      );
    }

    if (
      key === 'path' &&
      (t.isStringLiteral(prop.value) ||
        t.isTemplateLiteral(prop.value) ||
        t.isIdentifier(prop.value) ||
        t.isMemberExpression(prop.value))
    ) {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('path'),
          t.jsxExpressionContainer(prop.value),
        ),
      );
    }

    if (key === 'handle') {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('handle'),
          t.jsxExpressionContainer(prop.value),
        ),
      );
    }

    if (key === 'Component') {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('Component'),
          t.jsxExpressionContainer(prop.value),
        ),
      );
    }

    if (key === 'element') {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('element'),
          t.jsxExpressionContainer(prop.value),
        ),
      );
    }

    if (key === 'children' && t.isArrayExpression(prop.value)) {
      children = prop.value.elements
        .filter(t.isObjectExpression)
        .map((el) => buildRouteJSX(el));
    }
  });

  return t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier('Route'),
      attributes,
      children.length === 0,
    ),
    children.length > 0 ? t.jsxClosingElement(t.jsxIdentifier('Route')) : null,
    children,
    children.length === 0,
  );
};

/**
 * Processes the input file and generates the output file
 * @param {string} sourceFilePath - The path to the input file
 * @param {string} targetFilePath - The path to the output file
 */
const processFile = async (sourceFilePath, targetFilePath) => {
  const inputPath = path.resolve(currentDirPath, sourceFilePath);
  const outputPath = path.resolve(currentDirPath, targetFilePath);

  const sourceCode = fs.readFileSync(inputPath, 'utf8');

  const ast = parser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  let componentCounter = 0;
  let routesASTNode = null;

  // First pass: collect route information
  traverse(ast, {
    // Remove const lazyRouteConfig
    VariableDeclaration(nodePath) {
      const declaration = nodePath.node.declarations[0];
      if (t.isIdentifier(declaration.id, { name: 'lazyRouteConfig' })) {
        nodePath.remove();
      }
    },

    // Remove `import { RouteObject }` from 'react-router-dom'
    ImportDeclaration(nodePath) {
      if (
        nodePath.node.source.value === 'react-router-dom' &&
        nodePath.node.specifiers.some(
          (s) =>
            t.isImportSpecifier(s) &&
            (t.isIdentifier(s.imported, { name: 'RouteObject' }) ||
              t.isIdentifier(s.imported, { name: 'Router' })),
        )
      ) {
        const remainingSpecifiers = nodePath.node.specifiers.filter(
          (s) =>
            !(
              t.isImportSpecifier(s) &&
              (t.isIdentifier(s.imported, { name: 'RouteObject' }) ||
                t.isIdentifier(s.imported, { name: 'Router' }))
            ),
        );

        if (remainingSpecifiers.length === 0) {
          nodePath.remove();
        } else {
          // Create a new node instead of modifying the existing one
          const newImportDeclaration = t.importDeclaration(
            remainingSpecifiers,
            nodePath.node.source,
          );
          nodePath.replaceWith(newImportDeclaration);
        }
      }
    },

    // Transform lazyRouteConfig(...) to Component: LazyComponentX
    CallExpression(nodePath) {
      if (nodePath.get('callee').isIdentifier({ name: 'lazyRouteConfig' })) {
        const importArgument = nodePath.node.arguments[0];
        if (importArgument?.type === 'ArrowFunctionExpression') {
          const lazyComponentName = `LazyComponent${componentCounter}`;
          componentCounter += 1; // Use += instead of ++
          const importPath = importArgument.body.arguments[0].value;

          const reactLazyExpression = t.callExpression(
            t.memberExpression(t.identifier('React'), t.identifier('lazy')),
            [
              t.arrowFunctionExpression(
                [],
                t.callExpression(t.identifier('import'), [
                  t.stringLiteral(importPath),
                ]),
              ),
            ],
          );

          const newLazyDeclaration = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(lazyComponentName),
              reactLazyExpression,
            ),
          ]);

          const parentStatement = nodePath.findParent((p) => p.isStatement());
          parentStatement.insertBefore(newLazyDeclaration);

          const spreadParent = nodePath.findParent((p) =>
            t.isSpreadElement(p.node),
          );
          const objectExpression = nodePath.findParent((p) =>
            t.isObjectExpression(p.node),
          );

          if (spreadParent && objectExpression) {
            // Create a new array instead of modifying the existing one
            const filteredProperties = objectExpression.node.properties.filter(
              (prop) => prop !== spreadParent.node,
            );

            // Create a new object expression
            const newObjectExpression = t.objectExpression([
              ...filteredProperties,
              t.objectProperty(
                t.identifier('Component'),
                t.identifier(lazyComponentName),
              ),
            ]);

            // Replace the old object expression
            objectExpression.replaceWith(newObjectExpression);
          } else {
            nodePath.replaceWith(
              t.objectExpression([
                t.objectProperty(
                  t.identifier('Component'),
                  t.identifier(lazyComponentName),
                ),
              ]),
            );
          }
        }
      }
    },

    ExportNamedDeclaration(nodePath) {
      const { declaration } = nodePath.node;
      if (
        t.isVariableDeclaration(declaration) &&
        declaration.declarations.length === 1 &&
        t.isIdentifier(declaration.declarations[0].id, { name: 'routes' }) &&
        t.isArrayExpression(declaration.declarations[0].init)
      ) {
        routesASTNode = declaration.declarations[0].init;
      }
    },
  });

  // Add JSX version of routes in const RoutesElement = <Routes>...</Routes>;
  if (routesASTNode) {
    const jsxTree = createRoutesJSXTree(routesASTNode.elements, buildRouteJSX);
    const exportDefault = t.exportDefaultDeclaration(jsxTree);

    addRequiredImports(ast);
    ast.program.body.push(exportDefault);
  } else {
    // If routesASTNode is not found, look for a Routes variable
    let routesVariable = null;

    traverse(ast, {
      VariableDeclaration(nodePath) {
        const declaration = nodePath.node.declarations[0];
        if (
          t.isIdentifier(declaration.id, { name: 'Routes' }) &&
          t.isArrayExpression(declaration.init)
        ) {
          routesVariable = declaration;
        }
      },
    });

    if (routesVariable) {
      const jsxTree = createRoutesJSXTree(
        routesVariable.init.elements,
        buildRouteJSX,
      );
      const exportDefault = t.exportDefaultDeclaration(jsxTree);

      addRequiredImports(ast);
      ast.program.body.push(exportDefault);
    }
  }

  // Remove the routes variable if it exists
  let routesToRemove = null;
  traverse(ast, {
    ExportNamedDeclaration(nodePath) {
      const { declaration } = nodePath.node;
      if (
        t.isVariableDeclaration(declaration) &&
        declaration.declarations.length === 1 &&
        t.isIdentifier(declaration.declarations[0].id, { name: 'routes' })
      ) {
        routesToRemove = nodePath.node;
      }
    },
    VariableDeclaration(nodePath) {
      const declaration = nodePath.node.declarations[0];
      if (
        t.isIdentifier(declaration.id, { name: 'routes' }) &&
        !nodePath.parentPath.isExportNamedDeclaration()
      ) {
        routesToRemove = nodePath.node;
      }
    },
  });

  if (routesToRemove) {
    ast.program.body = ast.program.body.filter(
      (node) => node !== routesToRemove,
    );
  }

  const output = generator(ast, { retainLines: false, concise: true }).code;

  const formattedOutput = await prettier.format(output, {
    parser: 'babel-ts',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    endOfLine: 'lf',
    trailingComma: 'all',
    bracketSpacing: true,
    arrowParens: 'always',
    printWidth: 100,
  });

  const finalOutput = sortImports(formattedOutput);

  fs.writeFileSync(outputPath, finalOutput);
  // Use a more appropriate logging method or disable the rule for this line
  // eslint-disable-next-line no-console
  console.log(`Transformed routes written to ${targetFilePath}`);
};

processFile(inputFilePath, outputFilePath);
