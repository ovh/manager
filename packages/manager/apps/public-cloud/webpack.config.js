const glob = require('glob');
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
  }, process.env.REGION ? Object.assign(env, { region: process.env.REGION }) : env);

  // Extra config files
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: Object.assign({
      main: './src/index.js',
    }, extras.length > 0 ? { extras } : {}),
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        __FEEDBACK_URL_EN__: process.env.FEEDBACK_URL_EN ? `'${process.env.FEEDBACK_URL_EN}'` : 'null',
        __FEEDBACK_URL_FR__: process.env.FEEDBACK_URL_FR ? `'${process.env.FEEDBACK_URL_FR}'` : 'null',
        __NG_APP_INJECTIONS__: process.env.NG_APP_INJECTIONS ? `'${process.env.NG_APP_INJECTIONS}'` : 'null',
        __NODE_ENV__: process.env.NODE_ENV ? `'${process.env.NODE_ENV}'` : '"development"',
        __WEBPACK_REGION__: process.env.REGION ? `'${process.env.REGION.toUpperCase()}'` : '"EU"',
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
