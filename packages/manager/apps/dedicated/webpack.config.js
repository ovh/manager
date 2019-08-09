const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const webpackConfig = require('@ovh-ux/manager-webpack-config');

const folder = './src/app';
const bundles = {};

fs.readdirSync(folder).forEach((file) => {
  const stats = fs.lstatSync(`${folder}/${file}`);
  if (file === 'components') return;
  if (file === 'dedicatedUniverseComponents') return;
  if (stats.isDirectory()) {
    const jsFiles = glob.sync(`${folder}/${file}/**/!(*.module).js`);
    if (jsFiles.length > 0) {
      bundles[file] = jsFiles;
    }
  }
});

module.exports = (env = {}) => {
  const { config } = webpackConfig({
    template: './src/app/index.html',
    basePath: './src/app',
    lessPath: [
      './node_modules',
    ],
    root: path.resolve(__dirname, './src/app'),
    assets: {
      files: [
        { from: path.resolve(__dirname, './node_modules/angular-i18n'), to: 'resources/angular/i18n' },
        { from: path.resolve(__dirname, './src/**/*.html'), context: 'src/app' },
        { from: path.resolve(__dirname, './src/app/images/**/*.*'), context: 'src/app' },
        { from: path.resolve(__dirname, './node_modules/ckeditor'), to: 'ckeditor' },
        { from: path.resolve(__dirname, './node_modules/@ovh-ux/ovh-utils-angular/src/**/*.html'), context: 'node_modules/@ovh-ux/ovh-utils-angular/src', to: 'components/ovh-utils-angular' },
        { from: path.resolve(__dirname, './node_modules/ovh-module-exchange/src/exchange/**/*.html'), context: 'node_modules/ovh-module-exchange/src' },
      ],
    },
  }, env);

  config.plugins.push(new webpack.DefinePlugin({
    WEBPACK_ENV: {
      region: JSON.stringify(env.region),
      production: JSON.stringify(env.production),
    },
  }));

  if (env.region === 'eu' || env.region === 'ca') {
    bundles.exchange = [].concat(
      glob.sync('./node_modules/ovh-module-exchange/src/exchange/**/*.module.js'),
      glob.sync('./node_modules/ovh-module-exchange/src/exchange/**/!(*.module).js'),
    );
  }

  // Extra config files
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: _.assign({
      app: [
        './src/app/index.js',
        './src/app/app.js',
        './src/app/app.routes.js',
      ]
        .concat(glob.sync('./src/app/**/*.module.js'))
        .concat(glob.sync('./src/app/components/**/!(*.module).js')),
    }, bundles, extras.length > 0 ? { extras } : {}),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    resolve: {
      alias: {
        jquery: path.resolve(__dirname, 'node_modules/jquery'),
      },
      mainFields: ['module', 'browser', 'main'],
    },
    plugins: [
      new webpack.DefinePlugin({
        __NG_APP_INJECTIONS__: process.env.NG_APP_INJECTIONS ? `'${process.env.NG_APP_INJECTIONS}'` : 'null',
        __WEBPACK_REGION__: `'${env.region.toUpperCase()}'`,
      }),
    ],
  });
};
