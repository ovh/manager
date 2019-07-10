const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const webpack = require('webpack');

const folder = './client/app';
const bundles = {};

const webpackConfig = require('@ovh-ux/manager-webpack-config');

fs.readdirSync(folder).forEach((file) => {
  const stats = fs.lstatSync(`${folder}/${file}`);
  if (file === 'components') return;
  if (file === 'webUniverseComponents') return;
  if (stats.isDirectory()) {
    const jsFiles = glob.sync(`${folder}/${file}/**/!(*.module).js`);
    if (jsFiles.length > 0) {
      bundles[file] = jsFiles;
    }
  }
});

module.exports = (env = {}) => {
  const { config } = webpackConfig({
    template: './client/app/index.html',
    basePath: './client/app',
    lessPath: [
      './node_modules',
    ],
    root: path.resolve(__dirname, './client/app'),
    assets: {
      files: [
        { from: path.resolve(__dirname, './client/assets'), to: 'assets' },
        { from: path.resolve(__dirname, './node_modules/angular-i18n'), to: 'resources/angular/i18n' },
        { from: path.resolve(__dirname, './node_modules/@ovh-ux/ovh-utils-angular/src/**/*.html'), context: 'node_modules/@ovh-ux/ovh-utils-angular/src', to: 'components/ovh-utils-angular' },
        { from: path.resolve(__dirname, './client/**/*.html'), context: 'client/app' },
        { from: path.resolve(__dirname, './node_modules/ckeditor'), to: 'ckeditor' },
        { from: path.resolve(__dirname, './node_modules/ovh-module-exchange/src/exchange/**/*.html'), context: 'node_modules/ovh-module-exchange/src' },
        { from: path.resolve(__dirname, './node_modules/ovh-module-office/src/microsoft/**/*.html'), context: 'node_modules/ovh-module-office/src' },
        { from: path.resolve(__dirname, './node_modules/ovh-module-sharepoint/src/sharepoint/**/*.html'), context: 'node_modules/ovh-module-sharepoint/src' },
        { from: path.resolve(__dirname, './node_modules/ovh-module-emailpro/src/emailpro/**/*.html'), context: 'node_modules/ovh-module-emailpro/src' },
      ],
    },
  }, env);

  // Module exchange
  bundles.exchange = [].concat(
    glob.sync('./node_modules/ovh-module-exchange/src/exchange/**/*.module.js'),
    glob.sync('./node_modules/ovh-module-exchange/src/exchange/**/!(*.module).js'),
  );

  // Module office
  bundles.office = glob.sync('./node_modules/ovh-module-office/src/microsoft/**/*.js');

  // Module sharepoint
  bundles.sharepoint = [].concat(
    glob.sync('./node_modules/ovh-module-sharepoint/src/sharepoint/**/*.module.js'),
    glob.sync('./node_modules/ovh-module-sharepoint/src/sharepoint/**/!(*.module).js'),
  );

  // Module emailpro
  bundles.emailpro = [].concat(
    glob.sync('./node_modules/ovh-module-emailpro/src/emailpro/**/*.module.js'),
    glob.sync('./node_modules/ovh-module-emailpro/src/emailpro/**/!(*.module).js'),
  );

  config.plugins.push(new webpack.DefinePlugin({
    WEBPACK_ENV: {
      region: JSON.stringify(env.region),
      production: JSON.stringify(env.production),
    },
  }));

  // Extra config files
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: _.assign({
      app: [
        './client/app/index.js',
        './client/app/app.js',
        './client/app/app.routes.js',
        './client/app/app.controller.js',
      ].concat(glob.sync('./client/app/**/*.module.js'))
        .concat(glob.sync('./client/app/components/**/!(*.module).js')),
    }, bundles, extras.length > 0 ? { extras } : {}),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    resolve: {
      alias: {
        jquery: path.resolve(__dirname, 'node_modules/jquery'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __WEBPACK_REGION__: `'${env.region.toUpperCase()}'`,
      }),
    ],
  });
};
