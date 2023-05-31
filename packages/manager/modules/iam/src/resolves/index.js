import angular from 'angular';

import types from './types';

/**
 * Register each param type onto the given $urlMatcherFactoryProvider
 * @see https://ui-router.github.io/ng1/docs/latest/interfaces/params.paramdeclaration.html#type
 * @see https://ui-router.github.io/ng1/docs/latest/interfaces/params.paramtypedefinition.html
 * @param {UrlMatcherFactoryProvider} $urlMatcherFactoryProvider
 */
const registerTypes = /* @ngInject */ ($urlMatcherFactoryProvider) =>
  Object.values(types).forEach(({ type, ...definition }) =>
    $urlMatcherFactoryProvider.type(type, definition),
  );

const moduleName = 'ovhManagerIAMResolves';

angular
  .module(moduleName, [])
  .config(registerTypes)
  .run(/* @ngTranslationsInject:json ./translations */);

export * from './breadcrumbs.resolve';
export * from './guides.resolve';
export * from './misc.resolve';
export * from './params.resolve';
export * from './types';
export default moduleName;
