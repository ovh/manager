const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RemcalcPlugin = require('less-plugin-remcalc');
const WebpackBar = require('webpackbar');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const get = require('lodash/get');
const set = require('lodash/set');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpackRetryChunckLoadPlugin = require('webpack-retry-chunk-load-plugin');

const RetryChunkLoadPlugin = Object.assign(
  webpackRetryChunckLoadPlugin.RetryChunkLoadPlugin,
);

const webpack = require('webpack');

const cacheLoader = {
  loader: 'cache-loader',
  options: {
    cacheDirectory: path.resolve(process.cwd(), 'node_modules/.cache-loader'),
  },
};

// The common webpack configuration

module.exports = (opts) => {
  const lessLoaderOptions = {
    sourceMap: true,
    plugins: [
      RemcalcPlugin, // required by ovh-ui-kit
    ],
    relativeUrls: false,
  };

  if ('lessPath' in opts) {
    set(lessLoaderOptions, 'paths', opts.lessPath);
  }

  if ('lessJavascriptEnabled' in opts) {
    set(lessLoaderOptions, 'javascriptEnabled', opts.lessJavascriptEnabled);
  }

  const jsExclude = [
    /\/node_modules/, // vendors
    /\/dist/, // bundled files
  ];

  return {
    plugins: [
      // copy application assets
      // note: we could use the html-loader plugin but it wouldn't work for dynamic src attributes!
      new CopyWebpackPlugin(
        get(opts, 'assets.files', []),
        get(opts, 'assets.options', {}),
      ),

      // see : https://github.com/jantimon/html-webpack-plugin
      new HtmlWebpackPlugin({
        template: opts.template, // path to application's main html template
      }),

      // display pretty loading bars
      new WebpackBar({
        name: 'OVH Manager',
        color: '#59d2ef',
      }),

      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].css',
      }),

      new webpack.DefinePlugin({
        __VERSION__: process.env.VERSION ? `'${process.env.VERSION}'` : 'null',
      }),

      new RetryChunkLoadPlugin({
        // optional stringified function to get the cache busting query string appended to the script src
        // if not set will default to appending the string `?cache-bust=true`
        cacheBust: `function() {
          return Date.now();
        }`,
        // optional value to set the maximum number of retries to load the chunk. Default is 1
        maxRetries: 5,
      }),
    ],

    resolve: {
      modules: ['./node_modules', path.resolve('./node_modules')],
    },

    resolveLoader: {
      // webpack module resolution paths
      modules: [
        './node_modules', // #1 check in module's relative node_module directory
        path.resolve('./node_modules'), // #2 check in application's node_module directory
      ],
    },

    module: {
      rules: [
        // load HTML files as string (raw-loader)
        {
          test: /\.html$/,
          loader: 'raw-loader',
        },

        // load images & fonts into file or convert to base64 if size < 10Kib
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            esModule: false,
          },
        },

        // load css files
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            cacheLoader,
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
            {
              loader: 'resolve-url-loader', // specify relative path for Less files
              options: {
                root: opts.root,
              },
            },
          ],
        },

        // load Less files
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            cacheLoader,
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
            {
              loader: 'resolve-url-loader', // specify relative path for Less files
              options: {
                root: opts.root,
              },
            },
            {
              loader: 'less-loader', // compiles Less to CSS
              options: { lessOptions: lessLoaderOptions },
            },
          ],
        },

        // load Sass files
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            cacheLoader,
            'css-loader', // translates CSS into CommonJS
            'sass-loader', // compiles Sass to CSS
          ],
        },

        // normalize json translation files
        {
          test: /Messages_\w+_\w+\.json$/,
          use: [
            cacheLoader,
            {
              loader: path.resolve(__dirname, './loaders/translation-json.js'),
            },
          ],
        },

        // load JS files
        {
          test: /\.js$/,
          exclude: jsExclude,
          use: [
            cacheLoader,
            {
              loader: 'babel-loader', // babelify JS sources
              options: {
                presets: [
                  require.resolve('@babel/preset-env'), // babel preset configuration
                ],
                plugins: [
                  require.resolve('@babel/plugin-proposal-class-properties'), // class properties
                  require.resolve('@babel/plugin-proposal-optional-chaining'), // optional chaining
                  require.resolve('@babel/plugin-proposal-private-methods'), // private methods
                  require.resolve('@babel/plugin-syntax-dynamic-import'), // dynamic es6 imports
                  require.resolve('babel-plugin-angularjs-annotate'), // ng annotate
                ],
                shouldPrintComment: (val) => !/@ngInject/.test(val),
              },
            },
          ],
        },

        // inject translation imports into JS source code,
        // given proper ui-router state 'translations' property
        {
          test: /\.js$/,
          exclude: jsExclude,
          enforce: 'pre',
          use: [
            cacheLoader,
            {
              loader: path.resolve(
                __dirname,
                './loaders/translation-ui-router.js',
              ),
              options: {
                subdirectory: 'translations',
                filtering: false,
              },
            },
          ],
        },

        // inject translation with @ngTranslationsInject comment
        {
          test: /\.js$/,
          exclude: jsExclude,
          enforce: 'pre',
          use: [
            cacheLoader,
            {
              loader: path.resolve(
                __dirname,
                './loaders/translation-inject.js',
              ),
              options: {
                filtering: false,
              },
            },
          ],
        },
      ], // \rules
    }, // \module

    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
      runtimeChunk: 'single',
      // bundle spliting configuration
      splitChunks: {
        // vendors bundle containing node_modules source code
        cacheGroups: {
          bower: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]@bower_components[\\/]/,
            name: 'bower',
            enforce: true,
            priority: 1,
          },
          ovh: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]@ovh-ux[\\/]/,
            name: 'ovh',
            enforce: true,
            priority: 1,
          },
          vendor: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            enforce: true,
          },
        },
      },
    }, // \optimization
  };
};
