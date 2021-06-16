const get = require('lodash/get');
const has = require('lodash/has');
const map = require('lodash/map');
const last = require('lodash/last');
const pluginUtils = require('@rollup/pluginutils');
const estreeWalker = require('estree-walker');
const MagicString = require('magic-string');
const utils = require('./translation-utils');

const createFilter = Object.assign(pluginUtils.createFilter);
const walk = Object.assign(estreeWalker.walk);

const removeProperty = (code, magicString, start, end) => {
  magicString.remove(start, end);
  for (let i = end; i < code.length - 1; i += 1) {
    const ch = code[i];
    if (ch === ',') {
      magicString.remove(i, i + 1);
      break;
    } else if (/\w|}/.test(ch)) {
      break;
    }
  }
};

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

  return {
    name: 'translation-ui-router',
    transform(code, id) {
      if (filtering && !filter(id)) return null;
      const ast = this.parse(code);
      const magicString = new MagicString(code);
      walk(ast, {
        enter(node) {
          if (sourcemap) {
            magicString.addSourcemapLocation(node.start);
            magicString.addSourcemapLocation(node.end);
          }
          if (get(node, 'callee.property.name') === 'state') {
            const props = get(last(get(node, 'arguments')), 'properties');

            const translations =
              props &&
              props.filter(
                (item) =>
                  item &&
                  item.key &&
                  item.key.name === 'translations' &&
                  item.type === 'Property',
              )[0];

            if (translations) {
              let value;

              if (has(translations, 'value.elements')) {
                value = map(get(translations, 'value.elements'), 'value');
              } else {
                const myObj = get(translations, 'value.properties');
                value = get(
                  myObj.filter(({ key }) => key.name === 'value')[0],
                  'value.elements',
                ).map(({ value: v }) => v);
              }

              const resolve = last(
                get(
                  props.filter(
                    ({ key, type }) =>
                      key.name === 'resolve' && type === 'Property',
                  )[0],
                  'value.properties',
                ),
              );

              let inject = utils.injectTranslationImports(
                languages,
                value,
                id,
                subdirectory,
              );

              inject = `translations: /* @ngInject */ ($q, $translate, asyncLoader) => { ${inject} }`;

              removeProperty(
                code,
                magicString,
                translations.start,
                translations.end,
              );

              if (resolve) {
                magicString.appendRight(resolve.end, `,${inject}`);
              } else {
                const firstProp = get(node, 'arguments[1].properties[0]');
                inject = `resolve: { ${inject} },`;
                magicString.appendLeft(firstProp.start, inject);
              }
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
