import { createFilter } from '@rollup/pluginutils';
import MagicString from 'magic-string';
import utils from './translation-utils';

export default (opts: any = {}) => {
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
      const annotationMatch = code.match(annotationRegex);

      if (annotationMatch) {
        const annotation = annotationMatch[0];
        const { index } = annotationMatch;
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
