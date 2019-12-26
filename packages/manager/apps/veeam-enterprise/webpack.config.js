const webpackConfig = require('@ovh-ux/manager-webpack-config');
const path = require('path');
const merge = require('webpack-merge');

module.exports = (env = {}) => {
  const { config } = webpackConfig(
    {
      template: './src/index.html',
      basePath: './src',
      lessPath: ['./node_modules'],
      root: path.resolve(__dirname, './src'),
    },
    env,
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
  });
};
