const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const webpackConfig = require('@ovh-ux/manager-webpack-config');

const folder = './src/app/telecom';
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
  if (stats.isDirectory()) {
    const jsFiles = glob.sync(`${folder}/${file}/**/*.js`, {
      ignore: `${folder}/${file}/carrierSip/*.js`,
    });
    if (jsFiles.length > 0) {
      bundles[file] = jsFiles;
    }
  }
});

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
          { from: path.resolve(__dirname, './src/**/*.html'), context: 'src' },
          {
            from: path.resolve(
              __dirname,
              '../../../../node_modules/@ovh-ux/ng-ovh-line-diagnostics/dist/assets',
            ),
            to: 'assets',
          },
        ],
      },
    },
    env,
  );

  // Extra config files
  const extrasRegion = glob.sync('./.extras-EU/**/*.js');
  const extras = glob.sync('./.extras/**/*.js');

  return merge(config, {
    entry: _.assign(
      {
        main: './src/app/index.js',
        telecom: glob.sync('./src/app/telecom/*.js'),
        components: glob.sync('./src/components/**/*.js'),
        config: [
          './src/app/config/all.js',
          `./src/app/config/${env.production ? 'prod' : 'dev'}.js`,
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
      mainFields: ['module', 'browser', 'main'],
    },
  });
};
