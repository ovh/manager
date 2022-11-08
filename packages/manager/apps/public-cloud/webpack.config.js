const fs = require('fs');
const glob = require('glob');
const { merge } = require('webpack-merge');
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
    env,
  );

  // Extra config files
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: {
      main: './src/index.js',
      ...(extras.length > 0 ? { extras } : {}),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
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
        __NG_APP_INJECTIONS__: getNgAppInjections(['EU', 'CA', 'US']),
        __NODE_ENV__: process.env.NODE_ENV
          ? `'${process.env.NODE_ENV}'`
          : '"development"',
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
