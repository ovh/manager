import { ALERT_ID, FEATURE, UNAVAILABLE_STATE_NAME } from './iam.constants';
import {
  advancedModeResolve,
  alertResolve,
  defaultBreadcrumbResolve,
  featuresResolve,
  goBackResolve,
  goToResolve,
  hasPoliciesResolve,
  onboardingGuidesResolve,
  usersManagementLinkResolve,
} from './resolves';

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
        .getAsync(featuresResolve.key)
        .then((featureAvailabilityResult) =>
          featureAvailabilityResult.isFeatureAvailable(FEATURE.MAIN)
            ? 'iam.policy'
            : { state: UNAVAILABLE_STATE_NAME },
        ),
    resolve: {
      advancedMode: advancedModeResolve,
      alert: alertResolve,
      breadcrumb: defaultBreadcrumbResolve,
      features: featuresResolve,
      goBack: goBackResolve,
      goTo: goToResolve,
      hasPolicies: hasPoliciesResolve,
      onboardingGuides: onboardingGuidesResolve,
      usersManagementLink: usersManagementLinkResolve,
    },
  });
};
