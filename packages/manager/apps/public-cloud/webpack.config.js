const fs = require('fs');
const glob = require('glob');
const merge = require('webpack-merge');
const path = require('path');
const webpackConfig = require('@ovh-ux/manager-webpack-config');
const webpack = require('webpack');

function readNgAppInjections(file) {
  let injections = [];
  if (fs.existsSync(file)) {
    injections = fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .filter((value) => value !== '');
  }
  return injections;
}

function getNgAppInjections(region) {
  const injections = [
    ...readNgAppInjections(`./.extras-${region}/ng-app-injections`),
    ...readNgAppInjections('./.extras/ng-app-injections'),
  ];

  const ngAppInjections = injections.map((val) => `'${val}'`).join(',');

  return ngAppInjections || 'null';
}

module.exports = (env = {}) => {
  const { config } = webpackConfig(
    {
      template: './src/index.html',
      basePath: './src',
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
    process.env.REGION
      ? Object.assign(env, { region: process.env.REGION })
      : env,
  );

  let WEBPACK_REGION;

  if (env.region) {
    WEBPACK_REGION = `${env.region}`;
  } else {
    WEBPACK_REGION = process.env.REGION
      ? `${process.env.REGION.toUpperCase()}`
      : 'EU';
  }

  // Extra config files
  const extrasRegion = glob.sync(`./.extras-${WEBPACK_REGION}/**/*.js`);
  const extras = glob.sync('./.extras/**/*.js');

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
        __NG_APP_INJECTIONS__: getNgAppInjections(WEBPACK_REGION),
        __NODE_ENV__: process.env.NODE_ENV
          ? `'${process.env.NODE_ENV}'`
          : '"development"',
        __WEBPACK_REGION__: `'${WEBPACK_REGION}'`,
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
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
