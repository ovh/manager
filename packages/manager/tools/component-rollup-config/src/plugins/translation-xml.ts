import { createFilter } from '@rollup/pluginutils';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import set from 'lodash/set';
import common from './common';

export = (opts:any = {}) => {
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
        set(translations, get(match, '[1]'), get(match, '[4]', ''));
      }
      return {
        code: `export default ${JSON.stringify(mapValues(translations, common.translationNormalize))};`,
        map: null,
      };
    },
  };
};
