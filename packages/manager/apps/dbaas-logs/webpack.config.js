const _ = require('lodash');
const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const merge = require('webpack-merge');
const fs = require('fs');
const webpackConfig = require('@ovh-ux/manager-webpack-config');

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

function getNgAppInjections(regions) {
  return regions.reduce((ngAppInjections, region) => {
    const injections = [
      ...readNgAppInjections(`./.extras-${region}/ng-app-injections`),
      ...readNgAppInjections('./.extras/ng-app-injections'),
    ];

    return {
      ...ngAppInjections,
      [region]: JSON.stringify(injections),
    };
  }, {});
}

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
        /de|en-gb|es|es-us|fr-ca|fr|it|pl|pt/,
      ),
      new webpack.DefinePlugin({
        __WEBPACK_REGION__: `'${REGION}'`,
        __NODE_ENV__: process.env.NODE_ENV
          ? `'${process.env.NODE_ENV}'`
          : '"development"',
      }),
      new webpack.DefinePlugin({
        __NG_APP_INJECTIONS__: getNgAppInjections(['EU', 'CA', 'US']),
        __NODE_ENV__: process.env.NODE_ENV
          ? `'${process.env.NODE_ENV}'`
          : '"development"',
      }),
    ],
  });
};
