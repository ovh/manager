const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const webpack = require('webpack'); // eslint-disable-line
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
    env,
  );

  // Extra config files
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: {
      main: path.resolve('./client/app/index.js'),
      ...(extras.length > 0 ? { extras } : {}),
    },
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
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /cs|de|en-gb|es|es-us|fi|fr-ca|fr|it|lt|pl|pt/,
      ),
      new webpack.DefinePlugin({
        __NG_APP_INJECTIONS__: getNgAppInjections(['EU', 'CA', 'US']),
        WEBPACK_ENV: {
          production: JSON.stringify(env.production),
        },
        __NODE_ENV__: process.env.NODE_ENV
          ? `'${process.env.NODE_ENV}'`
          : '"development"',
      }),
    ],
  });
};
