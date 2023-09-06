const { merge } = require('webpack-merge');
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
  const { config } = webpackConfig(
    {
      template: './src/index.html',
      basePath: './src',
      root: path.resolve(__dirname, './src/app'),
      assets: {
        files: [
          { from: path.resolve(__dirname, './src/assets'), to: 'assets' },
          {
            from: path.resolve(__dirname, './src/app/common/assets'),
            to: 'assets',
          },
          { from: foundNodeModulesFolder('angular-i18n'), to: 'angular-i18n' },
          {
            from: path.resolve(__dirname, './src/**/*.html'),
            context: 'src/',
            filter: (resource) => {
              if (resource === path.resolve(__dirname, 'src/index.html')) {
                return false;
              }
              return true;
            },
          },
        ],
      },
    },
    env,
  );

  // Extra config files
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: {
      main: path.resolve('./src/app/index.js'),
      ...(extras.length > 0 ? { extras } : {}),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    resolve: {
      mainFields: ['module', 'browser', 'main'],
      fallback: {
        stream: require.resolve('stream-browserify'),
        os: require.resolve('os-browserify/browser'),
      },
    },
    plugins: [
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /de|en-gb|es|es-us|fr-ca|fr|it|pl|pt/,
      ),
      new webpack.ContextReplacementPlugin(
        /flatpicker[/\\]dist[/\\]l10n$/,
        /de|es|es|fr|it|pl|pt/,
      ),
      new webpack.DefinePlugin({
        __NODE_ENV__: process.env.NODE_ENV
          ? `'${process.env.NODE_ENV}'`
          : '"development"',
        __NG_APP_INJECTIONS__: getNgAppInjections(['EU']),
        WEBPACK_ENV: {
          production: !!env.production,
        },
      }),
    ],
  });
};
