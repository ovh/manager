const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const webpack = require('webpack');

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
      template: './client/app/index.html',
      basePath: './client/app',
      lessPath: ['./node_modules', '../../../node_modules'],
      root: path.resolve(__dirname, './client/app'),
      assets: {
        files: [
          { from: path.resolve(__dirname, './client/assets'), to: 'assets' },
          {
            from: path.resolve(__dirname, './client/**/*.html'),
            context: 'client/app',
          },
          {
            from: foundNodeModulesFolder('angular-i18n'),
            to: 'resources/angular/i18n',
          },
          { from: foundNodeModulesFolder('ckeditor'), to: 'ckeditor' },
        ],
      },
    },
    env,
  );

  config.plugins.push(
    new webpack.DefinePlugin({
      WEBPACK_ENV: {
        region: JSON.stringify(env.region),
        production: JSON.stringify(env.production),
      },
    }),
  );

  // Extra config files
  const extrasRegion = glob.sync(`./.extras-EU/**/*.js`);
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: {
      main: path.resolve('./client/app/index.js'),
      ...(extras.length > 0 ? { extras } : {}),
      ...(extrasRegion.length > 0 ? { extrasRegion } : {}),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    resolve: {
      mainFields: ['module', 'browser', 'main'],
    },
    plugins: [
      new webpack.DefinePlugin({
        __WEBPACK_REGION__: `'${env.region.toUpperCase()}'`,
        __NG_APP_INJECTIONS__: getNgAppInjections(env.region.toUpperCase()),
      }),
    ],
  });
};
