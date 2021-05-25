const loaderUtils = require('loader-utils');
const get = require('lodash/get');
const merge = require('lodash/merge');
const pick = require('lodash/pick');
const acorn = require('acorn');
const classFields = require('acorn-class-fields');
const optionalChaining = require('acorn-optional-chaining');
const privateMethods = require('acorn-private-methods');
const componentConfig = require('@ovh-ux/component-rollup-config');
const acornDynamicImport = require('acorn-dynamic-import');

const getOptions = Object.assign(loaderUtils.getOptions);
const dynamicImport = acornDynamicImport.default;

module.exports = function injectTranslationsLoader(source) {
  const options = merge({ filtering: false }, getOptions(this));
  const translationInject = get(componentConfig, 'plugins.translationInject');

  const parser = acorn.Parser.extend(dynamicImport)
    .extend(classFields)
    .extend(optionalChaining)
    .extend(privateMethods);

  return get(
    translationInject(
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
