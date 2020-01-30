const glob = require('glob');
const merge = require('webpack-merge');
const path = require('path');
const webpackConfig = require('@ovh-ux/manager-webpack-config');
const webpack = require('webpack');

module.exports = (env = {}) => {
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
          { from: path.resolve(__dirname, 'src/assets/img'), to: 'assets/img' },
        ],
      },
    },
    process.env.REGION
      ? Object.assign(env, { region: process.env.REGION })
      : env,
  );

  // Extra config files
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: { main: './src/index.js', ...(extras.length > 0 ? { extras } : {}) },
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
