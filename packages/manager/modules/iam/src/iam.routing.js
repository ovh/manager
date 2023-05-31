import FeatureAvailabilityResult from '@ovh-ux/ng-ovh-feature-flipping/src/feature-availability-result.class';

import {
  ALERT_ID,
  FEATURE,
  GUIDE,
  UNAVAILABLE_STATE_NAME,
} from './iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam', {
    url: '/iam',
    template: `
      <div class="iam">
        <div data-ovh-alert="${ALERT_ID}" class="mt-3"></div>
        <div data-ui-view></div>
      </div>
    `,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('features')
        .then((featureAvailabilityResult) =>
          featureAvailabilityResult.isFeatureAvailable(FEATURE.MAIN)
            ? 'iam.policy'
            : { state: UNAVAILABLE_STATE_NAME },
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_breadcrumb'),

      /**
       * Get the status of the advanced mode
       * @returns {boolean}
       */
      advancedMode: /* @ngInject */ (PreferencesService) =>
        PreferencesService.isAdvancedModeEnabled(),

      /**
       * Display a Alerter message
       * @returns {{
       *   success: (key: string, values?: { [x: string]: any }) => void
       *   error: (key, values?: { [x: string]: any }) => void
       *   apiError: (key, object, values?: { [x: string]: any }) => void
       * }}
       */
      alert: /* @ngInject */ ($translate, Alerter) => ({
        success: (key, values) =>
          Alerter.success($translate.instant(key, values), ALERT_ID),
        error: (key, values) =>
          Alerter.error($translate.instant(key, values), ALERT_ID),
      }),

      /**
       * FeatureAvailability instance based on the FEATURE constant
       * @returns {FeatureAvailabilityResult}
       */
      features: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(Object.values(FEATURE))
          .catch(() => new FeatureAvailabilityResult()),

      /**
       * Go back to the previous state
       * @param {string} params The state.go params
       * @param {boolean} reload The state.go reload option
       * @param {string | { key: string, values: { [x: string]: any }}} success The success message to display
       * @param {string | { key: string, values: { [x: string]: any }}} error The error message to display
       */
      goBack: /* @ngInject */ (goTo) => ({
        params,
        reload,
        success,
        error,
      } = {}) => goTo({ params, reload, success, error, name: '^' }),

      /**
       * Go to a specific IAM state
       * @param {string} name The state.go name
       * @param {string} params The state.go params
       * @param {boolean} reload The state.go reload option
       * @param {string | { key: string, values: { [x: string]: any }}} success The success message to display
       * @param {string | { key: string, values: { [x: string]: any }}} error The error message to display
       */
      goTo: /* @ngInject */ ($state, alert) => ({
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
      },

      /**
       * Whether there are any policies given the read-only flag (a.k.a advanced mode)
       * @returns {boolean}
       */
      hasPolicies: /* @ngInject */ (PolicyService, advancedMode) =>
        PolicyService.getPolicies({
          ...(!advancedMode && { readOnly: false }),
        }).then(({ data }) => data.length > 0),

      /**
       * The onboarding guides
       * @returns {Object}
       */
      onboardingGuides: /* @ngInject */ (GuideService) =>
        GuideService.formatGuides(GUIDE.IAM, GUIDE.USERS, GUIDE.SAMLSSO),

      /**
       * Builds the url to go to the user management page
       * @returns {string}
       */
      usersManagementLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#/useraccount/users'),
    },
  });
};
