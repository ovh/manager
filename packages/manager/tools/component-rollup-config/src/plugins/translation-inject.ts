import { createFilter } from '@rollup/pluginutils';
import isEmpty from 'lodash/isEmpty';
import MagicString from 'magic-string';
import utils from './translation-utils';

export = (opts:any = {}) => {
  const include = opts.include || '**/*.js';
  const { exclude } = opts;
  const filter = createFilter(include, exclude);
  const sourcemap = opts.sourcemap !== false;
  const subdirectory = opts.subdirectory || './';
  const filtering = opts.filtering !== false;
  const languages = Array.isArray(opts.languages) ? opts.languages : utils.languages;

  return {
    name: 'translation-ui-router',
    transform(code, id) {
      if (filtering && !filter(id)) return null;
      const magicString = new MagicString(code);
      this.parse(code, {
        onComment: (block, text, start, end) => {
          const match = text.match(/@ngTranslationsInject:?([a-zA-Z]+)?(.*)/);
          if (Array.isArray(match) && match.length >= 3) {
            const translations = match[2].split(/\s+/);
            const format = match[1];

            if (Array.isArray(translations) && !isEmpty(translations)) {
              const inject = utils.injectTranslationImports(languages,
                translations, id, subdirectory, format);
              magicString.overwrite(start, end, `/* @ngInject */ ($translate, $q, asyncLoader) => { ${inject} }`);
            } else {
              magicString.overwrite(start, end, 'angular.noop');
            }
          }
        },
      });
      return {
        code: magicString.toString(),
        map: sourcemap ? magicString.generateMap({ hires: true }) : null,
      };
    },
  };
};
