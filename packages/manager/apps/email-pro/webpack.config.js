const _ = require('lodash');
const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const fs = require('fs');
const merge = require('webpack-merge');
const webpackConfig = require('@ovh-ux/manager-webpack-config');

function foundNodeModulesFolder(checkedDir, cwd = '.') {
  if (fs.existsSync(`${cwd}/node_modules/${checkedDir}`)) {
    return path.relative(process.cwd(), `${cwd}/node_modules/${checkedDir}`);
  }

  if (path.resolve(cwd) !== '/') {
    return foundNodeModulesFolder(checkedDir, `${cwd}/..`);
  }

  return null;
}

module.exports = (env = {}) => {
  const REGION = _.upperCase(env.region || process.env.REGION || 'EU');

  const { config } = webpackConfig(
    {
      template: './src/index.html',
      basePath: './src',
      lessPath: ['./node_modules'],
      root: path.resolve(__dirname, './src'),
      assets: {
        files: [{ from: foundNodeModulesFolder('ckeditor'), to: 'ckeditor' }],
      },
    },
    REGION ? Object.assign(env, { region: REGION }) : env,
  );

  return merge(config, {
    entry: path.resolve('./src/index.js'),
    resolve: {
      modules: [
        './node_modules',
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../../../node_modules'),
      ],
      mainFields: ['module', 'browser', 'main'],
    },
    plugins: [
      new webpack.DefinePlugin({
        __WEBPACK_REGION__: `'${REGION}'`,
      }),
    ],
  });
};
