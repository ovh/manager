import { get, merge, pick } from 'lodash';
import { getOptions } from 'loader-utils';
import { Parser } from 'acorn';
import componentConfig from '@ovh-ux/component-rollup-config';
import dynamicImport from 'acorn-dynamic-import';

export = function translationUiRouterLoader(source) {
  const options = merge({ filtering: false }, getOptions(this));
  const translationUiRouter = get(
    componentConfig,
    'plugins.translationUiRouter',
  );
  const parser = Parser.extend(dynamicImport);

  return get(
    translationUiRouter(
      pick(options, ['subdirectory', 'filtering']),
    ).transform.bind({
      parse: (code, opts = {}) =>
        parser.parse(
          code,
          {
            ecmaVersion: 9,
            sourceType: 'module',
            ...opts,
          },
        ),
    })(source, this.resourcePath),
    'code',
    source,
  );
};
