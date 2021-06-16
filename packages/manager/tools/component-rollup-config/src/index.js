const get = require('lodash/get');
const isString = require('lodash/isString');
const mergeWith = require('lodash/mergeWith');
const babelPlugin = require('@rollup/plugin-babel');
const camelcase = require('camelcase');
const commonjs = require('@rollup/plugin-commonjs');
const html = require('rollup-plugin-html');
const image = require('@rollup/plugin-image');
const json = require('@rollup/plugin-json');
const lessInject = require('@ovh-ux/rollup-plugin-less-inject');
const lessPluginRemcalc = require('less-plugin-remcalc');
const lessTildeImporter = require('@ovh-ux/rollup-plugin-less-tilde-importer');
const path = require('path');
const peerdeps = require('rollup-plugin-peer-deps-external');
const resolve = require('@rollup/plugin-node-resolve');
const sass = require('rollup-plugin-sass');
const dynamicImportVarsPlugin = require('@rollup/plugin-dynamic-import-vars');

const translationInject = require('./plugins/translation-inject');
const translationUiRouter = require('./plugins/translation-ui-router');
const common = require('./plugins/common');

const dynamicImportVars = dynamicImportVarsPlugin.default;
const babel = babelPlugin.default;

const defaultName = path.basename(process.cwd());

const mergeConfig = (config, customConfig) =>
  mergeWith(config, customConfig, (obj, src) =>
    Array.isArray(obj) && Array.isArray(src) ? src.concat(obj) : undefined,
  );

const getLanguages = (pluginsOpts) => {
  if (isString(process.env.LANGUAGES)) {
    return process.env.LANGUAGES.split('-');
  }
  return get(pluginsOpts, 'translations.languages');
};

const nodeResolve = (url) => {
  try {
    return require.resolve(url);
  } catch (e) {
    return null;
  }
};

const generateConfig = (opts, pluginsOpts) =>
  mergeConfig(
    {
      plugins: [
        peerdeps(),
        html(),
        json({
          preferConst: true,
          compact: true,
          namedExports: false,
        }),
        lessTildeImporter(pluginsOpts.lessTildeImporter),
        lessInject({
          option: {
            plugins: [lessPluginRemcalc],
          },
        }),
        sass({
          insert: true,
          output: false,
          options: {
            importer(url) {
              let filepath = nodeResolve(url);
              if (!filepath) filepath = nodeResolve(`${url}.scss`);
              if (!filepath) filepath = nodeResolve(`${url}.css`);
              if (!filepath) {
                throw new Error(`Unable to resolve sass import '${url}'`);
              }
              return {
                file: filepath,
              };
            },
          },
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
        dynamicImportVars({
          exclude: /node_modules\//,
        }),
        babel({
          babelHelpers: 'bundled',
          babelrc: false,
          exclude: 'node_modules/**',
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-private-methods',
            '@babel/plugin-syntax-dynamic-import',
            'babel-plugin-angularjs-annotate',
          ],
          presets: [['@babel/preset-env']],
          shouldPrintComment: (val) => !/@ngInject/.test(val),
        }),
      ],
    },
    opts,
  );

const cjs = (opts, pluginsOpts) =>
  generateConfig(
    mergeConfig(
      {
        output: {
          dir: './dist/cjs',
          format: 'cjs',
          sourcemap: true,
        },
      },
      opts,
    ),
    pluginsOpts,
  );

const umd = (opts, pluginsOpts) =>
  generateConfig(
    mergeConfig(
      {
        inlineDynamicImports: true,
        output: {
          name: defaultName,
          file: `./dist/umd/${defaultName}.js`,
          format: 'umd',
          sourcemap: true,
        },
      },
      opts,
    ),
    pluginsOpts,
  );

const es = (opts, pluginsOpts) =>
  generateConfig(
    mergeConfig(
      {
        output: {
          dir: './dist/esm',
          format: 'es',
          sourcemap: true,
        },
      },
      opts,
    ),
    pluginsOpts,
  );

const iife = (opts, pluginsOpts) =>
  generateConfig(
    mergeConfig(
      {
        inlineDynamicImports: true,
        output: {
          name: camelcase(defaultName),
          file: `./dist/iife/${defaultName}.js`,
          format: 'iife',
          sourcemap: true,
        },
      },
      opts,
    ),
    pluginsOpts,
  );

const config = (globalOpts = {}, pluginsOpts = {}) => ({
  cjs: (opts = {}) => cjs(mergeConfig(opts, globalOpts), pluginsOpts),
  es: (opts = {}) => es(mergeConfig(opts, globalOpts), pluginsOpts),
  iife: (opts = {}) => iife(mergeConfig(opts, globalOpts), pluginsOpts),
  umd: (opts = {}) => umd(mergeConfig(opts, globalOpts), pluginsOpts),
});

config.plugins = {
  translationInject,
  translationUiRouter,
};

config.common = {
  translationNormalize: common.translationNormalize,
};

module.exports = config;
