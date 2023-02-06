const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const merge = require('webpack-merge');
const webpackConfig = require('@ovh-ux/manager-webpack-config');

module.exports = (env = {}) => {
  const { config } = webpackConfig(
    {
      template: './src/iam.template.html',
      basePath: './src',
      lessPath: ['./node_modules'],
      root: path.resolve(__dirname, './src'),
    },
    env,
  );

  return merge(config, {
    entry: {
      main: path.resolve('./src/index.js'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[chunkhash].bundle.js',
    },
    resolve: {
      modules: [
        './node_modules',
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../../../node_modules'),
      ],
      mainFields: ['module', 'browser', 'main'],
    },
    plugins: [
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /de|en-gb|es|es-us|fr-ca|fr|it|pl|pt/,
      ),

      new webpack.DefinePlugin({
        __NODE_ENV__: process.env.NODE_ENV
          ? `"${process.env.NODE_ENV}"`
          : '"development"',
      }),
    ],
  });
};
