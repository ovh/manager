const key = 'breadcrumb';
const pfx = 'iam_resolves_breadcrumbs';

// ---------------------------------------------------------------------------------------------------- //

/**
 * The create policy breadcrumb
 * @returns {string}
 */
const createPolicyBreadcrumbResolve = /* @ngInject */ ($translate) =>
  $translate.instant(`${pfx}_create_policy`);

createPolicyBreadcrumbResolve.key = key;

// ---------------------------------------------------------------------------------------------------- //

/**
 * The default breadcrumb
 * @returns {string}
 */
const defaultBreadcrumbResolve = /* @ngInject */ ($translate) =>
  $translate.instant(`${pfx}_default`);

defaultBreadcrumbResolve.key = key;

// ---------------------------------------------------------------------------------------------------- //

/**
 * No breadcrumb (hide it)
 * @returns {null}
 */
const noBreadcrumbResolve = () => null;

noBreadcrumbResolve.key = key;

// ---------------------------------------------------------------------------------------------------- //

export {
  createPolicyBreadcrumbResolve,
  defaultBreadcrumbResolve,
  noBreadcrumbResolve,
};
