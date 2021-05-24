import { get, isString, mergeWith } from 'lodash';
import babel from '@rollup/plugin-babel';
import camelcase from 'camelcase';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';
import html from 'rollup-plugin-html';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import lessInject from '@ovh-ux/rollup-plugin-less-inject';
import lessPluginRemcalc from 'less-plugin-remcalc';
import lessTildeImporter from '@ovh-ux/rollup-plugin-less-tilde-importer';
import path from 'path';
import peerdeps from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import sass from 'rollup-plugin-sass';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

import translationInject from './plugins/translation-inject';
import translationUiRouter from './plugins/translation-ui-router';
import common from './plugins/common';

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
            }
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

export = config;
