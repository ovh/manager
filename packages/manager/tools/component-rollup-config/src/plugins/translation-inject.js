const pluginUtils = require('@rollup/pluginutils');
const MagicString = require('magic-string');
const utils = require('./translation-utils');

const createFilter = Object.assign(pluginUtils.createFilter);

module.exports = (opts) => {
  const include = opts.include || '**/*.js';
  const { exclude } = opts;
  const filter = createFilter(include, exclude);
  const sourcemap = opts.sourcemap !== false;
  const subdirectory = opts.subdirectory || './';
  const filtering = opts.filtering !== false;
  const languages = Array.isArray(opts.languages)
    ? opts.languages
    : utils.languages;

  const annotationRegex = /\/\*\s*@ngTranslationsInject[^*]+\*\//;
  return {
    name: 'translation-ui-router',
    transform(code, id) {
      if (filtering && !filter(id)) return null;
      const magicString = new MagicString(code);
      const regex = new RegExp(annotationRegex, 'g');
      for (
        let match = regex.exec(code);
        match !== null;
        match = regex.exec(code)
      ) {
        const annotation = match[0];
        const { index } = match;
        const translations = annotation.split(/\s+/).slice(2, -1);
        const transform = utils.injectTranslationImports(
          languages,
          translations,
          id,
          subdirectory,
        );
        magicString.overwrite(
          index,
          index + annotation.length,
          `/* @ngInject */ ($translate, $q, asyncLoader) => { ${transform} }`,
        );
      }
      return {
        code: magicString.toString(),
        map: sourcemap ? magicString.generateMap({ hires: true }) : null,
      };
    },
  };
};
