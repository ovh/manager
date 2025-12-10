import traverseModule from '@babel/traverse';

const traverse = traverseModule.default;

/**
 * Safely extract an array node (including TypeScript casted arrays).
 */
const extractArrayNode = (node) => {
  if (!node || typeof node !== 'object') return null;

  if (node.type === 'ArrayExpression') return node;

  if (node.type === 'TSAsExpression' && node.expression?.type === 'ArrayExpression') {
    return node.expression;
  }

  return null;
};

/**
 * Traverse exported route arrays from the AST and apply a callback.
 * Supports:
 *  - export default [ ... ]
 *  - const routes = [ ... ]
 *  - export const routes = [ ... ]
 */
export const traverseRoutesExportNodes = (
  ast,
  { onArrayExpression, isTargetNode = (node) => node?.id?.name?.match(/^routes?$/i) } = {},
) => {
  if (typeof onArrayExpression !== 'function') {
    console.warn('⚠️ Missing or invalid onArrayExpression callback in traverseRoutesExportNodes');
    return;
  }

  try {
    traverse(ast, {
      ExportDefaultDeclaration: ({ node }) => {
        const array = extractArrayNode(node?.declaration);
        if (array) {
          onArrayExpression(array, 'default');
        } else {
          console.warn('⚠️ export default is not an ArrayExpression');
        }
      },

      VariableDeclarator: ({ node }) => {
        if (!node || typeof node !== 'object') return;

        const array = extractArrayNode(node.init);

        if (array && isTargetNode(node)) {
          onArrayExpression(array, 'named');
        } else if (
          !array &&
          node.init?.type === 'ArrayExpression' &&
          node.parent?.type === 'ExportNamedDeclaration'
        ) {
          onArrayExpression(node.init, 'named-export');
        }
      },
    });
  } catch (err) {
    console.error('❌ Error in traverseRoutesExportNodes:', err.message);
  }
};
