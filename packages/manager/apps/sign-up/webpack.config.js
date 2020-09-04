const glob = require('glob');
const merge = require('webpack-merge');
const path = require('path');
const webpackConfig = require('@ovh-ux/manager-webpack-config');
const webpack = require('webpack');

const REGION = process.env.REGION || 'EU';

module.exports = (env = {}) => {
  Object.assign(env, REGION ? { region: REGION } : {});
  const { config } = webpackConfig(
    {
      template: './src/index.html',
      basePath: './src',
      root: path.resolve(__dirname, './src'),
      assets: {
        files: [
          {
            from: path.resolve(
              __dirname,
              '../../../../node_modules/flag-icon-css/flags/4x3',
            ),
            to: 'flag-icon-css/flags/4x3',
          },
          {
            from: path.resolve(
              __dirname,
              `src/assets/img/logo${
                env.region && env.region.toUpperCase() === 'US'
                  ? '/trademark'
                  : '/classic'
              }`,
            ),
            to: 'assets/img/logo',
          },
        ],
      },
    },
    env,
  );

  // Extra config files
  const extras = glob.sync('./.extras/**/*.js');
  const extrasRegion = glob.sync(`./.extras-${REGION}/**/*.js`);

  return merge(config, {
    entry: {
      main: './src/index.js',
      ...(extras.length > 0 ? { extras } : {}),
      ...(extrasRegion.length > 0 ? { extrasRegion } : {}),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        __NG_APP_INJECTIONS__: process.env.NG_APP_INJECTIONS
          ? `'${process.env.NG_APP_INJECTIONS}'`
          : 'null',
        __WEBPACK_REGION__: process.env.REGION
          ? `'${process.env.REGION.toUpperCase()}'`
          : '"EU"',
        __NODE_ENV__: process.env.NODE_ENV
          ? `'${process.env.NODE_ENV}'`
          : '"development"',
      }),
    ],
    resolve: {
      modules: [
        path.resolve(process.cwd(), './node_modules'),
        path.resolve(process.cwd(), '../../../../node_modules'),
      ],
      mainFields: ['module', 'browser', 'main'],
    },
  });
};
