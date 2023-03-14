import FeatureAvailabilityResult from '@ovh-ux/ng-ovh-feature-flipping/src/feature-availability-result.class';

import { ALERT_ID, ENTITY, FEATURE } from '@iam/constants';
import { policyParamResolve } from './params.resolve';

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
const entityResolve = /* @ngInject */ (policy) => {
  if (policy) return { data: policy, type: ENTITY.POLICY };
  return null;
};

entityResolve.key = 'entity';
entityResolve.resolves = [policyParamResolve];

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

export {
  alertResolve,
  entityResolve,
  featuresResolve,
  goBackResolve,
  goToResolve,
};
