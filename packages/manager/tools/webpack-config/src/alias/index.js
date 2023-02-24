const path = require('path');

const iam = require('./iam');

const modules = [iam];

/**
 * Input
 *
 * {
 *   module: 'path/of/the/module'
 *   name: 'my',
 *   basePath: './src',
 *   aliases: ['assets', 'components', ...],
 * }
 *
 * Output
 *
 * {
 *   "@my/assets": "path/of/the/module/src/assets",
 *   "@my/components": "path/of/the/module/src/components",
 *   ...
 * }
 *
 */
module.exports = modules.reduce(
  (allAliases, { module, name, basePath = '', aliases }) => ({
    ...allAliases,
    ...aliases.reduce(
      (appAliases, alias) => ({
        ...appAliases,
        [`@${name}/${alias}`]: path.join(module, basePath, alias),
      }),
      {},
    ),
  }),
  {},
);
