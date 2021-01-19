const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const webpackConfig = require('@ovh-ux/manager-webpack-config');

module.exports = (env = {}) => {
  const { config } = webpackConfig(
    {
      template: './src/index.html',
      basePath: './src',
      root: path.resolve(__dirname, './src'),
    },
    env,
  );
  return config;
};
