const breadcrumbKey = 'breadcrumb';

// ---------------------------------------------------------------------------------------------------- //

/**
 * Null breadcrumb (hide it)
 * @returns {null}
 */
export const nullBreadcrumbResolve = () => null;

nullBreadcrumbResolve.key = breadcrumbKey;

// ---------------------------------------------------------------------------------------------------- //

/**
 * The default breadcrumb
 * @returns {string}
 */
export const defaultBreadcrumbResolve = /* @ngInject */ ($translate) =>
  $translate.instant('iam_resolves_breadcrumbs_default');

defaultBreadcrumbResolve.key = breadcrumbKey;

// ---------------------------------------------------------------------------------------------------- //

export default {
  nullBreadcrumbResolve,
  defaultBreadcrumbResolve,
};
