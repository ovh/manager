const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const webpackConfig = require('@ovh-ux/manager-webpack-config');

const folder = './src/app';
const bundles = {};

function foundNodeModulesFolder(checkedDir, cwd = '.') {
  if (fs.existsSync(`${cwd}/node_modules/${checkedDir}`)) {
    return path.relative(process.cwd(), `${cwd}/node_modules/${checkedDir}`);
  }

  if (path.resolve(cwd) !== '/') {
    return foundNodeModulesFolder(checkedDir, `${cwd}/..`);
  }

  return null;
}

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

const ovhUtilsAngularDir = foundNodeModulesFolder('@ovh-ux/ovh-utils-angular');

module.exports = (env = {}) => {
  const { config } = webpackConfig({
    template: './src/app/index.html',
    basePath: './src/app',
    lessPath: [
      './node_modules',
    ],
    lessJavascriptEnabled: true,
    root: path.resolve(__dirname, './src/app'),
    assets: {
      files: [
        { from: path.resolve(__dirname, './src/**/*.html'), context: 'src/app' },
        { from: path.resolve(__dirname, './src/app/images/**/*.*'), context: 'src/app' },
        { from: foundNodeModulesFolder('ckeditor'), to: 'ckeditor' },
        { from: foundNodeModulesFolder('angular-i18n'), to: 'resources/angular/i18n' },
        { from: `${ovhUtilsAngularDir}/src/**/*.html`, context: `${ovhUtilsAngularDir}/src`, to: 'components/ovh-utils-angular' },
      ],
    },
  }, env);

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
