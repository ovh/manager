import FeatureAvailabilityResult from '@ovh-ux/ng-ovh-feature-flipping/src/feature-availability-result.class';
import { ALERT_ID, FEATURE } from '@iam/constants';

// ---------------------------------------------------------------------------------------------------- //

/**
 * Display a Alerter message
 * @returns {{
 *   success: (key: string, values?: { [x: string]: any }) => void
 *   error: (key, values?: { [x: string]: any }) => void
 *   apiError: (key, object, values?: { [x: string]: any }) => void
 * }}
 */
export const alertResolve = /* @ngInject */ ($translate, Alerter) => ({
  success: (key, values) =>
    Alerter.success($translate.instant(key, values), ALERT_ID),
  error: (key, values) =>
    Alerter.error($translate.instant(key, values), ALERT_ID),
  apiError: (key, error) => {
    const message = error?.data?.message || error?.message || error || '';
    return Alerter.error($translate.instant(key, { message }), ALERT_ID);
  },
});

alertResolve.key = 'alert';

// ---------------------------------------------------------------------------------------------------- //

/**
 * FeatureAvailability instance based on the FEATURE constant
 * @returns {FeatureAvailabilityResult}
 */
export const featuresResolve = /* @ngInject */ (ovhFeatureFlipping) =>
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
 * @param {boolean} notify The state.go notity option
 * @param {string | { key: string, values: { [x: string]: any }}} success The success message to display
 * @param {string | { key: string, values: { [x: string]: any }}} error The error message to display
 */
export const goToResolve = /* @ngInject */ ($state, alert) => ({
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

export default {
  alertResolve,
  featuresResolve,
  goToResolve,
};
