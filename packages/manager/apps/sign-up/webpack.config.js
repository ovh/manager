const merge = require('webpack-merge');
const path = require('path');
const webpackConfig = require('@ovh-ux/manager-webpack-config');
const webpack = require('webpack');

module.exports = (env = {}) => {
  const { config } = webpackConfig({
    template: './src/index.html',
    basePath: '.',
    root: path.resolve(process.cwd()),
    assets: {
      files: [
        { from: path.resolve(__dirname, '../../../../node_modules/flag-icon-css/flags/4x3'), to: 'flag-icon-css/flags/4x3' },
        { from: path.resolve(__dirname, 'src/assets/img'), to: 'assets/img' },
      ],
    },
  }, process.env.REGION ? Object.assign(env, { region: process.env.REGION }) : env);

  return merge(config, {
    entry: path.resolve('./src/index.js'),
    plugins: [
      new webpack.DefinePlugin({
        __FEEDBACK_URL__: process.env.FEEDBACK_URL ? `'${process.env.FEEDBACK_URL}'` : 'null',
        __WEBPACK_REGION__: process.env.REGION ? `'${process.env.REGION.toUpperCase()}'` : '"EU"',
        __NODE_ENV__: process.env.NODE_ENV ? `'${process.env.NODE_ENV}'` : '"development"',
        __NG_APP_INJECTIONS__: process.env.NG_APP_INJECTIONS ? `'${process.env.NG_APP_INJECTIONS}'` : 'null',
      }),
    ],
    resolve: {
      modules: [
        path.resolve(process.cwd(), './node_modules'),
        path.resolve(process.cwd(), '../../../../node_modules'),
      ],
      mainFields: [
        'module',
        'browser',
        'main',
      ],
    },
  });
};
