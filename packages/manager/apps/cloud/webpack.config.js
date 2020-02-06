const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const webpack = require('webpack'); // eslint-disable-line
const webpackConfig = require('@ovh-ux/manager-webpack-config');

const folder = './client/app';
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

fs.readdirSync(folder).forEach((file) => {
  // skip config folder, it'll be added later depending on current environment
  if (file === 'config') {
    return;
  }
  const stats = fs.lstatSync(`${folder}/${file}`);
  if (stats.isDirectory()) {
    const jsFiles = glob.sync(`${folder}/${file}/**/!(*.spec|*.mock).js`);
    if (jsFiles.length > 0) {
      bundles[file] = jsFiles;
    }
  }
});

module.exports = (env = {}) => {
  const REGION = _.upperCase(env.region || process.env.REGION || 'EU');

  const { config } = webpackConfig(
    {
      template: './client/index.html',
      basePath: './client',
      lessPath: ['./client/app', './client/components', './node_modules'],
      lessJavascriptEnabled: true,
      root: path.resolve(__dirname, './client/app'),
      assets: {
        files: [
          { from: path.resolve(__dirname, './client/assets'), to: 'assets' },
          { from: foundNodeModulesFolder('angular-i18n'), to: 'angular-i18n' },
          {
            from: path.resolve(__dirname, './client/**/*.html'),
            context: 'client',
          },
        ],
      },
    },
    REGION ? Object.assign(env, { region: REGION }) : env,
  );

  // Extra config files
  const extrasRegion = glob.sync(`./.extras-EU/**/*.js`);
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: _.assign(
      {
        main: './client/app/index.js',
        components: glob.sync('./client/components/**/!(*.spec|*.mock).js'),
        config: [
          `./client/app/config/all.${REGION.toLowerCase()}.js`,
          `./client/app/config/${
            env.production ? 'prod' : 'dev'
          }.${REGION.toLowerCase()}.js`,
        ],
      },
      bundles,
      extras.length > 0 ? { extras } : {},
      extrasRegion.length > 0 ? { extrasRegion } : {},
    ),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    resolve: {
      modules: [
        './node_modules',
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../../../node_modules'),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __WEBPACK_REGION__: `'${REGION}'`,
        __NG_APP_INJECTIONS__: getNgAppInjections(REGION),
      }),
    ],
  });
};
