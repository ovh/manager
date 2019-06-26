const _ = require('lodash');
const { createFilter } = require('rollup-pluginutils');

const filterText = (text) => {
  if (text) {
    const filtered = text
      .toString()
      .replace(/&#13;\n/g, ' ') // carriage returns
      .replace(/&#160;/g, ' ') // spaces
      .replace(/\{(\s?\d\s?)\}/g, '{{t$1}}'); // {0} => {{t0}}
    return filtered;
  }
  return text;
};

module.exports = (opts = {}) => {
  const include = opts.include || '**/Messages_*.xml';
  const { exclude } = opts;
  const filter = createFilter(include, exclude);
  const filtering = opts.filtering !== false;
  return {
    name: 'translation-xml-import',
    transform(code, id) {
      if (filtering && !filter(id)) return null;
      const reg = /<translation\s+id="([\w-]+?)"\s*(qtlid="([0-9]+)")?\s*(?:translate="none")?\s*?>((?:.|\n|\r)*?)<\/translation>/gi;
      const translations = {};
      let match;
      while (match = reg.exec(code)) { // eslint-disable-line no-cond-assign
        _.set(translations, _.get(match, 1), _.get(match, 4, ''));
      }
      return {
        code: `export default ${JSON.stringify(_.mapValues(translations, filterText))};`,
        map: null,
      };
    },
  };
};
