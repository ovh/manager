import { createFilter } from '@rollup/pluginutils';
// import isEmpty from 'lodash/isEmpty';
import MagicString from 'magic-string';
import fs from 'fs';
import path from 'path';
import utils from './translation-utils';

export = (opts: any = {}) => {
  const include = opts.include || '**/*.js';
  const { exclude } = opts;
  const filter = createFilter(include, exclude);
  const sourcemap = opts.sourcemap !== false;
  const subdirectory = opts.subdirectory || './';
  const filtering = opts.filtering !== false;
  const languages = Array.isArray(opts.languages)
    ? opts.languages
    : utils.languages;

  return {
    name: 'translation-i18next',
    transform(code, id) {
      if (filtering && !filter(id)) return null;
      const magicString = new MagicString(code);
      this.parse(code, {
        onComment: (block, text, start, end) => {
          const match = text.match(/translationsInject?(.*)/);
          if (Array.isArray(match)) {
            const namespace = match[1] || 'translation';
            const dirname = path.dirname(id);
            const fullTradPath = path.resolve(
              dirname,
              './translations',
              subdirectory,
            );

            const fallback = `
              import fr from './translations/Messages_fr_FR.json';
              i18next.addResources('fr_FR', ${namespace}, fr);
            `;

            const imports = languages
              .filter((lang) =>
                fs.existsSync(path.join(fullTradPath, `Messages_${lang}.json`)),
              )
              .map(
                (lang) =>
                  `
                  if (i18next.language === '${lang}' && '${lang}' !== 'fr_FR') {
                    import('./translations/Messages_${lang}.json')
                      .then(module => module.default ? module.default : module)
                      .then((translations) => i18next.addResources('${lang}', ${namespace}, translations));
                  }
                  `,
              )
              .join('\n');

            magicString.overwrite(
              start,
              end,
              `
              ${fallback}
              ${imports}
              `,
            );
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
