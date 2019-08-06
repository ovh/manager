import { get, merge } from 'lodash';
import { getOptions } from 'loader-utils';
import componentConfig from '@ovh-ux/component-rollup-config';

export = function translationsXMLLoader(source) {
  const options = merge({ filtering: false }, getOptions(this));
  const translationXML = get(componentConfig, 'plugins.translationXML');
  return get(translationXML(options).transform(source, this.resourcePath), 'code', source);
};
