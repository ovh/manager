const breadcrumbKey = 'breadcrumb';

// ---------------------------------------------------------------------------------------------------- //

/**
 * The create policy breadcrumb
 * @returns {string}
 */
export const createPolicyBreadcrumb = /* @ngInject */ ($translate) =>
  $translate.instant('iam_resolves_breadcrumbs_create_policy');

createPolicyBreadcrumb.key = breadcrumbKey;

// ---------------------------------------------------------------------------------------------------- //

/**
 * The default breadcrumb
 * @returns {string}
 */
export const defaultBreadcrumbResolve = /* @ngInject */ ($translate) =>
  $translate.instant('iam_resolves_breadcrumbs_default');

defaultBreadcrumbResolve.key = breadcrumbKey;

// ---------------------------------------------------------------------------------------------------- //

/**
 * Null breadcrumb (hide it)
 * @returns {null}
 */
export const nullBreadcrumbResolve = () => null;

nullBreadcrumbResolve.key = breadcrumbKey;

// ---------------------------------------------------------------------------------------------------- //

export default {
  createPolicyBreadcrumb,
  defaultBreadcrumbResolve,
  nullBreadcrumbResolve,
};
