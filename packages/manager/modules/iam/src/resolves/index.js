import breadcrumbs from './breadcrumbs.resolve';
import guides from './guides.resolve';
import misc from './misc.resolve';
import params from './params.resolve';
import types from './types';

/**
 * Build a Set where all the keys represent the key property of each resolve function
 * and the values are the one-way angular binding symbole (e.g. '<')
 * @param {Function[]} resolves
 * @returns {Object<string, '<'>}
 */
export const asBindings = (resolves) =>
  resolves.reduce((map, res) => ({ ...map, [res.key]: '<' }), {});

/**
 * Build a Set where all the keys represent the key property of each resolve function
 * and the values are the resolve function itself
 * @param {Function[]} resolves
 * @returns {Object<string, function>}
 */
export const asResolve = (resolves) =>
  resolves.reduce(
    (map, res) => ({
      ...map,
      ...asResolve(res.resolves ?? []),
      [res.key]: res,
    }),
    {},
  );

/**
 * Build a query string with each resolve's key property separated by a &
 * @param {Function[]} resolves
 * @returns {string}
 */
export const asQuery = (resolves) => resolves.map(({ key }) => key).join('&');

/**
 * Build a Set where all the keys represent the key property of each resolve function
 * and the values are the resolve's declaration object
 * @see https://ui-router.github.io/ng1/docs/latest/interfaces/params.paramdeclaration.html
 * @param {Function[]} resolves
 * @returns {Object<string, ParamDeclaration>}
 */
export const asParams = (resolves) =>
  resolves.reduce(
    (map, { key, declaration, resolves: paramResolves }) => ({
      ...map,
      ...asParams(paramResolves ?? []),
      [key]: declaration,
    }),
    {},
  );

/**
 * Register each param type onto the given $urlMatcherFactoryProvider
 * @see https://ui-router.github.io/ng1/docs/latest/interfaces/params.paramdeclaration.html#type
 * @see https://ui-router.github.io/ng1/docs/latest/interfaces/params.paramtypedefinition.html
 * @param {UrlMatcherFactoryProvider} $urlMatcherFactoryProvider
 */
export const registerTypes = /* @ngInject */ ($urlMatcherFactoryProvider) =>
  Object.values(types).forEach(({ type, ...definition }) =>
    $urlMatcherFactoryProvider.type(type, definition),
  );

export * from './breadcrumbs.resolve';
export * from './guides.resolve';
export * from './misc.resolve';
export * from './params.resolve';
export * from './types';
export default {
  ...breadcrumbs,
  ...guides,
  ...misc,
  ...params,
};
