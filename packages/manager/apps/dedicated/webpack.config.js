const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
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

module.exports = (env = {}) => {
  const { config } = webpackConfig(
    {
      template: './client/app/index.html',
      basePath: './client/app',
      lessPath: ['./node_modules'],
      lessJavascriptEnabled: true,
      root: path.resolve(__dirname, './client/app'),
      assets: {
        files: [
          {
            from: path.resolve(__dirname, './client/**/*.html'),
            context: 'client/app',
          },
          {
            from: path.resolve(__dirname, './client/app/images/**/*.*'),
            context: 'client/app',
          },
          { from: path.resolve(__dirname, './client/assets'), to: 'assets' },
          { from: foundNodeModulesFolder('ckeditor'), to: 'ckeditor' },
          {
            from: foundNodeModulesFolder('angular-i18n'),
            to: 'resources/angular/i18n',
          },
          {
            from: `${foundNodeModulesFolder('flag-icon-css')}/flags`,
            to: 'flag-icon-css/flags',
          },
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
        path.resolve(process.cwd(), './node_modules'),
        path.resolve(process.cwd(), '../../../../node_modules'),
      ],
      mainFields: ['module', 'browser', 'main'],
    },
    plugins: [
      new webpack.DefinePlugin({
        __NG_APP_INJECTIONS__: process.env.NG_APP_INJECTIONS
          ? `'${process.env.NG_APP_INJECTIONS}'`
          : 'null',
      }),
    ],
    optimization: {
      runtimeChunk: 'single',
    },
  });
};
