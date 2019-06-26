const { get, merge } = require('lodash');
const { getOptions } = require('loader-utils');
const componentConfig = require('@ovh-ux/component-rollup-config');

module.exports = function translationsXMLLoader(source) {
  const options = merge({ filtering: false }, getOptions(this));
  const translationXML = get(componentConfig, 'plugins.translationXML');
  return get(translationXML(options).transform(source, this.resourcePath), 'code', source);
};
