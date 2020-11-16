import { get, merge, pick } from 'lodash';
import { getOptions } from 'loader-utils';
import { Parser } from 'acorn';
import classFields from 'acorn-class-fields';
import optionalChaining from 'acorn-optional-chaining';
import privateMethods from 'acorn-private-methods';
import componentConfig from '@ovh-ux/component-rollup-config';
import dynamicImport from 'acorn-dynamic-import';

export = function translationUiRouterLoader(source) {
  const options = merge({ filtering: false }, getOptions(this));
  const translationUiRouter = get(
    componentConfig,
    'plugins.translationUiRouter',
  );
  const parser = Parser.extend(dynamicImport)
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
