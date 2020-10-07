const _ = require('lodash');
const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const merge = require('webpack-merge');
const webpackConfig = require('@ovh-ux/manager-webpack-config');

module.exports = (env = {}) => {
  const REGION = _.upperCase(env.region || process.env.REGION || 'EU');

  const { config } = webpackConfig(
    {
      template: './src/index.html',
      basePath: './src',
      lessPath: ['./node_modules'],
      root: path.resolve(__dirname, './src'),
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
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /cs|de|en-gb|es|es-us|fi|fr-ca|fr|it|lt|pl|pt/,
      ),
      new webpack.DefinePlugin({
        __WEBPACK_REGION__: `'${REGION}'`,
      }),
    ],
  });
};
