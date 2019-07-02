import { get, isString, merge } from 'lodash';
import babel from 'rollup-plugin-babel';
import camelcase from 'camelcase';
import commonjs from 'rollup-plugin-commonjs';
import html from 'rollup-plugin-html';
import image from 'rollup-plugin-img';
import json from 'rollup-plugin-json';
import lessInject from '@ovh-ux/rollup-plugin-less-inject';
import lessPluginRemcalc from 'less-plugin-remcalc';
import lessTildeImporter from '@ovh-ux/rollup-plugin-less-tilde-importer';
import path from 'path';
import peerdeps from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import sass from 'rollup-plugin-sass';

import translationInject from './plugins/translation-inject';
import translationUiRouter from './plugins/translation-ui-router';
import translationXML from './plugins/translation-xml';

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
    lessInject({
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

export = config;
