const merge = require('webpack-merge');
const path = require('path');
const webpackConfig = require('@ovh-ux/manager-webpack-config');

module.exports = (env = {}) => {
  const { config } = webpackConfig(
    {
      template: path.resolve(__dirname, './src/index.html'),
      basePath: './src',
      root: path.resolve(__dirname, './src'),
    },
    env,
  );

  return merge(config, {
    entry: path.resolve('./src/index.js'),
    output: {
      publicPath: '/fragment-navbar/',
    },
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
