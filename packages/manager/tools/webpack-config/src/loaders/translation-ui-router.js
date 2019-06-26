const { get, merge, pick } = require('lodash');
const { getOptions } = require('loader-utils');
const acorn = require('acorn');
const componentConfig = require('@ovh-ux/component-rollup-config');
const dynamicImport = require('acorn-dynamic-import');

module.exports = function translationUiRouterLoader(source) {
  const options = merge({ filtering: false }, getOptions(this));
  const translationUiRouter = get(componentConfig, 'plugins.translationUiRouter');
  const parser = acorn.Parser.extend(dynamicImport.default);

  return get(translationUiRouter(pick(options, ['subdirectory', 'filtering'])).transform.bind({
    parse: (code, opts = {}) => parser.parse(code, merge({
      ecmaVersion: 9,
      sourceType: 'module',
    }, opts)),
  })(source, this.resourcePath), 'code', source);
};
