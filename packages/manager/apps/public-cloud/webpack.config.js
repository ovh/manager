const merge = require('webpack-merge');
const path = require('path');
const webpackConfig = require('@ovh-ux/manager-webpack-config');
const webpack = require('webpack');

module.exports = (env = {}) => {
  const { config } = webpackConfig({
    template: './src/index.html',
    basePath: './src',
    root: path.resolve(__dirname, './src'),
    assets: {
      files: [
        { from: path.resolve(__dirname, '../../../../node_modules/@ovh-ux/manager-pci/dist/assets'), to: 'assets' },
      ],
    },
  }, env);

  return merge(config, {
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        __FEEDBACK_URL__: process.env.FEEDBACK_URL ? `'${process.env.FEEDBACK_URL}'` : 'null',
      }),
    ],
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
