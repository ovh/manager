const get = require('lodash/get');
const merge = require('lodash/merge');
const pick = require('lodash/pick');
const acorn = require('acorn');
const classFields = require('acorn-class-fields');
const optionalChaining = require('acorn-optional-chaining');
const privateMethods = require('acorn-private-methods');
const componentConfig = require('@ovh-ux/component-rollup-config');
const acornDynamicImport = require('acorn-dynamic-import');

const dynamicImport = acornDynamicImport.default;

module.exports = function translationUiRouterLoader(source) {
  const options = merge({ filtering: false }, this.getOptions());
  const translationUiRouter = get(
    componentConfig,
    'plugins.translationUiRouter',
  );
  const parser = acorn.Parser.extend(dynamicImport)
    .extend(classFields)
    .extend(optionalChaining)
    .extend(privateMethods);

  return get(
    translationUiRouter(
      pick(options, ['subdirectory', 'filtering']),
    ).transform.bind({
      parse: (code, opts = {}) =>
        parser.parse(code, {
          ecmaVersion: 9,
          sourceType: 'module',
          ...opts,
        }),
    })(source, this.resourcePath),
    'code',
    source,
  );
};
