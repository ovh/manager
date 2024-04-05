import FeatureAvailabilityResult from '@ovh-ux/ng-ovh-feature-flipping/src/feature-availability-result.class';
import template from './iam.template.html';

import * as constants from './iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam', {
    url: '',
    template: Object.entries(constants).reduce(
      (content, [constant, value]) => content.replace(`%${constant}%`, value),
      template,
    ),
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('features')
        .then((featureAvailabilityResult) =>
          featureAvailabilityResult.isFeatureAvailable(constants.FEATURE.MAIN)
            ? 'iam.dashboard'
            : { state: constants.UNAVAILABLE_STATE_NAME },
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_breadcrumb'),

      /**
       * Get the status of the advanced mode
       * @returns {boolean}
       */
      advancedMode: /* @ngInject */ (IAMService) =>
        IAMService.isAdvancedModeEnabled(),

      /**
       * Display a Alerter message
       * @returns {{
       *   success: (key: string, values?: { [x: string]: any }) => void
       *   error: (key, values?: { [x: string]: any }) => void
       * }}
       */
      alert: /* @ngInject */ ($translate, Alerter) => ({
        success: (key, values) =>
          Alerter.success($translate.instant(key, values), constants.ALERT_ID),
        error: (key, values) =>
          Alerter.error($translate.instant(key, values), constants.ALERT_ID),
      }),

      /**
       * FeatureAvailability instance based on the FEATURE constant
       * @returns {FeatureAvailabilityResult}
       */
      features: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(Object.values(constants.FEATURE))
          .catch(() => new FeatureAvailabilityResult()),

      /**
       * Go back to the previous state
       * @param {string} params The state.go params
       * @param {boolean} reload The state.go reload option
       * @param {string | { key: string, values: { [x: string]: any }}} success The success message to display
       * @param {string | { key: string, values: { [x: string]: any }}} error The error message to display
       * @param {string} tag The page to tag
       */
      goBack: /* @ngInject */ (goTo) => ({
        params,
        reload,
        success,
        error,
        tag,
      } = {}) => goTo({ params, reload, success, error, tag, name: '^' }),

      /**
       * Go to a specific IAM state
       * @param {string} name The state.go name
       * @param {string} params The state.go params
       * @param {boolean} reload The state.go reload option
       * @param {string | { key: string, values: { [x: string]: any }}} success The success message to display
       * @param {string | { key: string, values: { [x: string]: any }}} error The error message to display
       * @param {string} tag The page to tag
       */
      goTo: /* @ngInject */ ($state, alert, trackPage) => ({
        name,
        params,
        reload,
        success,
        error,
        tag,
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
          if (tag) {
            trackPage(tag);
          }
          return result;
        });
      },

      /**
       * Whether there are any policies given the read-only flag (a.k.a advanced mode)
       * @returns {boolean}
       */
      hasPolicies: /* @ngInject */ (IAMService, advancedMode) =>
        IAMService.getPolicies({
          ...(!advancedMode && { readOnly: false }),
        })
          .then(({ data }) => data.length > 0)
          .catch(() => false),

      /**
       * The onboarding guides
       * @returns {Object}
       */
      onboardingGuides: /* @ngInject */ (IAMService) =>
        IAMService.formatGuides(
          constants.GUIDE.IAM,
          constants.GUIDE.USERS,
          constants.GUIDE.SAMLSSO,
        ),

      /**
       * Track a click action using the AT Internet provider
       * @returns {void}
       */
      trackClick: /* @ngInject */ (atInternet) => (name) => {
        atInternet.trackClick({ name, type: 'action' });
      },

      /**
       * Track a page using the AT Internet provider
       * @returns {void}
       */
      trackPage: /* @ngInject */ (atInternet) => (name) => {
        atInternet.trackPage({ name });
      },
    },
    atInternet: {
      ignore: true,
    },
  });
};
