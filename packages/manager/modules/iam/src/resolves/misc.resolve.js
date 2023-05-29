import FeatureAvailabilityResult from '@ovh-ux/ng-ovh-feature-flipping/src/feature-availability-result.class';

import { ALERT_ID, ENTITY, FEATURE } from '../constants';
import {
  policyParamResolve,
  identityParamResolve,
  resourceGroupParamResolve,
} from './params.resolve';

// ---------------------------------------------------------------------------------------------------- //

/**
 * Display a Alerter message
 * @returns {{
 *   success: (key: string, values?: { [x: string]: any }) => void
 *   error: (key, values?: { [x: string]: any }) => void
 *   apiError: (key, object, values?: { [x: string]: any }) => void
 * }}
 */
const alertResolve = /* @ngInject */ ($translate, Alerter) => ({
  success: (key, values) =>
    Alerter.success($translate.instant(key, values), ALERT_ID),
  error: (key, values) =>
    Alerter.error($translate.instant(key, values), ALERT_ID),
});

alertResolve.key = 'alert';

// ---------------------------------------------------------------------------------------------------- //

/**
 * A polymorphic DTO
 * The type of the entity it carries can be identified by its "type" property
 * To add a new type :
 * 1. Add a new entity type to the ENTITY constant
 * 2. Add the corresponding resolve to the "resolves" array
 * 3. Inject the corresponding resolve into the arguments
 * 4. Make the function return the resolved data with the "data" property
 * and the entity type with the "type" property
 * @returns {{
 *   data: Object,
 *   type: string
 * }|null}
 */
const entityResolve = /* @ngInject */ (policy, identity, resourceGroup) => {
  let entity = null;
  if (identity && policy) {
    entity = {
      data: { policy, identity, name: identity.componentsString },
      type: ENTITY.IDENTITY,
    };
  } else if (policy) {
    entity = { data: policy, type: ENTITY.POLICY };
  } else if (resourceGroup) {
    entity = { data: resourceGroup, type: ENTITY.RESOURCE_GROUP };
  }
  return entity;
};

entityResolve.key = 'entity';
entityResolve.resolves = [
  policyParamResolve,
  identityParamResolve,
  resourceGroupParamResolve,
];

// ---------------------------------------------------------------------------------------------------- //

/**
 * Whether the entity requires a statement
 * @returns {boolean}
 */
const statementResolve = /* @ngInject */ (entity) =>
  [ENTITY.POLICY].includes(entity.type);

statementResolve.key = 'statement';
statementResolve.resolves = [entityResolve];

// ---------------------------------------------------------------------------------------------------- //

/**
 * Get the status of the advanced mode
 * @returns {boolean}
 */
const advancedModeResolve = /* @ngInject */ (PreferencesService) => {
  return PreferencesService.isAdvancedModeEnabled();
};

advancedModeResolve.key = 'advancedMode';

// ---------------------------------------------------------------------------------------------------- //

/**
 * determines if there are any policies
 * @returns {boolean}
 */
const hasPoliciesResolve = /* @ngInject */ (PolicyService, advancedMode) => {
  return PolicyService.getPolicies({
    ...(!advancedMode && { readOnly: false }),
  }).then(({ data }) => data.length > 0);
};

hasPoliciesResolve.key = 'hasPolicies';
hasPoliciesResolve.resolves = [advancedModeResolve];

// ---------------------------------------------------------------------------------------------------- //

/**
 * FeatureAvailability instance based on the FEATURE constant
 * @returns {FeatureAvailabilityResult}
 */
const featuresResolve = /* @ngInject */ (ovhFeatureFlipping) =>
  ovhFeatureFlipping
    .checkFeatureAvailability(Object.values(FEATURE))
    .catch(() => new FeatureAvailabilityResult());

featuresResolve.key = 'features';

// ---------------------------------------------------------------------------------------------------- //

/**
 * Go to a specific IAM state
 * @param {string} name The state.go name
 * @param {string} params The state.go params
 * @param {boolean} reload The state.go reload option
 * @param {string | { key: string, values: { [x: string]: any }}} success The success message to display
 * @param {string | { key: string, values: { [x: string]: any }}} error The error message to display
 */
const goToResolve = /* @ngInject */ ($state, alert) => ({
  name,
  params,
  reload,
  success,
  error,
}) => {
  const options = {
    ...(typeof reload !== 'undefined' && { reload }),
  };
  return $state.go(name, params, options).then((result) => {
    if (success) {
      alert.success(success.key || success, success.values);
    } else if (error) {
      alert.error(error.key || error, error.values);
    }
    return result;
  });
};

goToResolve.key = 'goTo';
goToResolve.resolves = [alertResolve];

// ---------------------------------------------------------------------------------------------------- //

/**
 * Go back to the previous state
 * @param {string} params The state.go params
 * @param {boolean} reload The state.go reload option
 * @param {string | { key: string, values: { [x: string]: any }}} success The success message to display
 * @param {string | { key: string, values: { [x: string]: any }}} error The error message to display
 */
const goBackResolve = /* @ngInject */ (goTo) => ({
  params,
  reload,
  success,
  error,
} = {}) => goTo({ params, reload, success, error, name: '^' });

goBackResolve.key = 'goBack';
goBackResolve.resolves = [goToResolve];

// ---------------------------------------------------------------------------------------------------- //

/**
 * Builds the url to go to the user management page
 * @returns {string}
 */
const usersManagementLinkResolve = /* @ngInject */ (coreURLBuilder) =>
  coreURLBuilder.buildURL('dedicated', '#/useraccount/users');

usersManagementLinkResolve.key = 'usersManagementLink';

// ---------------------------------------------------------------------------------------------------- //

export {
  advancedModeResolve,
  alertResolve,
  entityResolve,
  featuresResolve,
  goBackResolve,
  goToResolve,
  hasPoliciesResolve,
  statementResolve,
  usersManagementLinkResolve,
};
