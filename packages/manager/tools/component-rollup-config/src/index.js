const { get, isString, merge } = require('lodash');
const babel = require('rollup-plugin-babel');
const camelcase = require('camelcase');
const commonjs = require('rollup-plugin-commonjs');
const html = require('rollup-plugin-html');
const image = require('rollup-plugin-img');
const json = require('rollup-plugin-json');
const less = require('rollup-plugin-less');
const lessPluginRemcalc = require('less-plugin-remcalc');
const lessTildeImporter = require('@ovh-ux/rollup-plugin-less-tilde-importer');
const path = require('path');
const peerdeps = require('rollup-plugin-peer-deps-external');
const resolve = require('rollup-plugin-node-resolve');
const sass = require('rollup-plugin-sass');
const translationInject = require('./plugins/translation-inject');
const translationUiRouter = require('./plugins/translation-ui-router');
const translationXML = require('./plugins/translation-xml');

const defaultName = path.basename(process.cwd());

const getLanguages = (pluginsOpts) => {
  if (isString(process.env.LANGUAGES)) {
    return process.env.LANGUAGES.split('-');
  }
  return get(pluginsOpts, 'translations.languages');
};

const generateConfig = (opts, pluginsOpts) => Object.assign({
  plugins: [
    peerdeps(),
    html(),
    json({
      preferConst: true,
      compact: true,
      namedExports: false,
    }),
    lessTildeImporter(pluginsOpts.lessTildeImporter),
    less({
      insert: true,
      // prevent generating a `rollup.build.css` file due to `insert: true` option.
      output: css => css,
      option: {
        plugins: [
          lessPluginRemcalc,
        ],
      },
    }),
    sass({
      insert: true,
      output: false,
    }),
    image({
      output: `./dist/assets/${defaultName}`,
    }),
    resolve(),
    commonjs(),
    translationInject({
      languages: getLanguages(pluginsOpts),
    }),
    translationUiRouter({
      subdirectory: 'translations',
      languages: getLanguages(pluginsOpts),
    }),
    translationXML(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        'babel-plugin-angularjs-annotate',
      ],
      presets: [
        ['@babel/preset-env'],
      ],
    }),
  ],
}, opts);

const cjs = (opts, pluginsOpts) => generateConfig(merge({
  output: {
    dir: './dist/cjs',
    format: 'cjs',
    sourcemap: true,
  },
}, opts), pluginsOpts);

const umd = (opts, pluginsOpts) => generateConfig(merge({
  inlineDynamicImports: true,
  output: {
    name: defaultName,
    file: `./dist/umd/${defaultName}.js`,
    format: 'umd',
    sourcemap: true,
  },
}, opts), pluginsOpts);

const es = (opts, pluginsOpts) => generateConfig(merge({
  output: {
    dir: './dist/esm',
    format: 'es',
    sourcemap: true,
  },
}, opts), pluginsOpts);

const iife = (opts, pluginsOpts) => generateConfig(merge({
  inlineDynamicImports: true,
  output: {
    name: camelcase(defaultName),
    file: `./dist/iife/${defaultName}.js`,
    format: 'iife',
    sourcemap: true,
  },
}, opts), pluginsOpts);

const config = (globalOpts = {}, pluginsOpts = {}) => ({
  cjs: (opts = {}) => cjs(merge(opts, globalOpts), pluginsOpts),
  es: (opts = {}) => es(merge(opts, globalOpts), pluginsOpts),
  iife: (opts = {}) => iife(merge(opts, globalOpts), pluginsOpts),
  umd: (opts = {}) => umd(merge(opts, globalOpts), pluginsOpts),
});

config.plugins = {
  translationInject,
  translationUiRouter,
  translationXML,
};

module.exports = config;
