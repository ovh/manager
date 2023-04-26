import { policyParamResolve } from './params.resolve';

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
 * The policyIdentities breadcrumb
 * @returns {string}
 */
const editPolicyBreadcrumbResolve = /* @ngInject */ ($translate, policy) =>
  $translate.instant(`${pfx}_edit_policy`, { policy: policy.name });

editPolicyBreadcrumbResolve.key = key;
editPolicyBreadcrumbResolve.resolves = [policyParamResolve];

// ---------------------------------------------------------------------------------------------------- //

/**
 * The policyIdentities breadcrumb
 * @returns {string}
 */
const policyIdentitiesBreadcrumbResolve = /* @ngInject */ (
  $translate,
  policy,
) => $translate.instant(`${pfx}_policy_identities`, { policy: policy.name });

policyIdentitiesBreadcrumbResolve.key = key;
policyIdentitiesBreadcrumbResolve.resolves = [policyParamResolve];

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
  editPolicyBreadcrumbResolve,
  policyIdentitiesBreadcrumbResolve,
  noBreadcrumbResolve,
};
