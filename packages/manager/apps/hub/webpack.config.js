const _ = require('lodash');
const glob = require('glob');
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
      assets: {
        files: [
          {
            from: path.resolve(__dirname, './src/assets/images'),
            to: 'assets/images/',
          },
        ],
      },
    },
    REGION ? Object.assign(env, { region: REGION }) : env,
  );

  // Extra config files
  const extrasRegion = glob.sync(`./.extras-${REGION}/**/*.js`);
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: {
      main: path.resolve('./src/index.js'),
      ...(extras.length > 0 ? { extras } : {}),
      ...(extrasRegion.length > 0 ? { extrasRegion } : {}),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
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
        __NODE_ENV__: process.env.NODE_ENV
          ? `'${process.env.NODE_ENV}'`
          : '"development"',
        __WEBPACK_REGION__: `'${REGION}'`,
        __NG_APP_INJECTIONS__: process.env.NG_APP_INJECTIONS
          ? `'${process.env.NG_APP_INJECTIONS}'`
          : 'null',
      }),
    ],
  });
};
