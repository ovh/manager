const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const RemcalcPlugin = require('less-plugin-remcalc');
// const WebpackBar = require('webpackbar');

module.exports = {
  entry: './packages/ovh-manager/ovh-manager.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: './packages/ovh-manager/ovh-manager.html',
    }),
    // new WebpackBar(),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          }, {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'resolve-url-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          }, {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              sourceMap: true,
              plugins: [
                RemcalcPlugin,
              ],
              paths: [
                path.resolve(__dirname, '../../node_modules'),
                path.resolve(__dirname, 'node_modules'),
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS
        ],
      },
      {
        test: /\.xml$/,
        loader: path.join(__dirname, '../../loaders/translations.js'),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                'angularjs-annotate',
              ],
            },
          },
        ],
      },
      {
        // ESLint is only used for the packages folder, at this moment, we can't merge rules
        // because we want to use babel and ngAnnotate all our code and dependencies if needed
        // But we don't want to check all our dependencies with ESLint
        // (+ webpack follow symlinks by default)
        // If you use this rule for babel, we will have some issues in production with obfuscation
        test: /\.js$/,
        exclude: /node_modules/,
        include: /packages/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {
              configFile: path.join(__dirname, '../../.eslintrc.json'),
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(process.cwd(), './node_modules'),
      './node_modules',
    ],
    alias: {
      angular: path.join(__dirname, '../../node_modules/angular'),
    },
    // modules: [path.join(__dirname, '../../node_modules'), 'node_modules'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
