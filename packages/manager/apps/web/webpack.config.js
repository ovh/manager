const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const webpack = require('webpack');

const folder = './client/app';
const bundles = {};

const webpackConfig = require('@ovh-ux/manager-webpack-config');

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
  if (stats.isDirectory()) {
    const jsFiles = glob.sync(`${folder}/${file}/**/!(*.module).js`);
    if (jsFiles.length > 0) {
      bundles[file] = jsFiles;
    }
  }
});

const depPaths = {};
const a = ['@ovh-ux/ovh-utils-angular', 'ovh-module-exchange', 'ovh-module-emailpro'];
a.forEach((dep) => {
  depPaths[dep] = foundNodeModulesFolder(dep);
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
        { from: path.resolve(__dirname, './client/**/*.html'), context: 'client/app' },
        { from: foundNodeModulesFolder('angular-i18n'), to: 'resources/angular/i18n' },
        { from: foundNodeModulesFolder('ckeditor'), to: 'ckeditor' },
        { from: path.resolve(depPaths['@ovh-ux/ovh-utils-angular'], './src/**/*.html'), context: `${depPaths['@ovh-ux/ovh-utils-angular']}/src`, to: 'components/ovh-utils-angular' },
        { from: path.resolve(depPaths['ovh-module-exchange'], './src/exchange/**/*.html'), context: `${depPaths['ovh-module-exchange']}/src` },
        { from: path.resolve(depPaths['ovh-module-emailpro'], './src/emailpro/**/*.html'), context: `${depPaths['ovh-module-emailpro']}/src` },
      ],
    },
  }, env);

  // Module exchange
  bundles.exchange = [].concat(
    glob.sync(
      `${depPaths['ovh-module-exchange']}/src/exchange/**/*.module.js`,
    ),
    glob.sync(`${depPaths['ovh-module-exchange']}/src/exchange/**/!(*.module).js`),
  );

  // Module emailpro
  bundles.emailpro = [].concat(
    glob.sync(`${depPaths['ovh-module-emailpro']}/src/emailpro/**/*.module.js`),
    glob.sync(`${depPaths['ovh-module-emailpro']}/src/emailpro/**/!(*.module).js`),
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
      ]
        .concat(glob.sync('./client/app/**/*.module.js'))
        .concat(glob.sync('./client/app/components/**/!(*.module).js')),
    }, bundles, extras.length > 0 ? { extras } : {}),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    // resolve: {
    //   alias: {
    //     jquery: path.resolve(__dirname, 'node_modules/jquery'),
    //   },
    // },
    plugins: [
      new webpack.DefinePlugin({
        __WEBPACK_REGION__: `'${env.region.toUpperCase()}'`,
      }),
    ],
  });
};
