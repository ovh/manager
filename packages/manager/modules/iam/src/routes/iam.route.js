import { FEATURE, UNAVAILABLE_STATE_NAME } from '../iam.constants';
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
} from '../resolves';

const name = 'iam';

const state = () => ({
  url: '/iam',
  component: 'iam',
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

export default {
  name,
  state,
};
