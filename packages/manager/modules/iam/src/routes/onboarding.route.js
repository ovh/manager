import {
  asResolve,
  noBreadcrumbResolve,
  hasPoliciesResolve,
  advancedModeResolve,
  alertResolve,
  goToResolve,
  onboardingGuidesResolve,
  usersManagementLinkResolve,
} from '../resolves';

const name = 'onboarding';
const resolves = [
  noBreadcrumbResolve,
  advancedModeResolve,
  alertResolve,
  goToResolve,
  hasPoliciesResolve,
  onboardingGuidesResolve,
  usersManagementLinkResolve,
];

const state = () => ({
  url: '/onboarding',
  component: 'iamOnboarding',
  resolve: {
    ...asResolve(resolves),
  },
  redirectTo: (transition) =>
    transition
      .injector()
      .getAsync(`${hasPoliciesResolve.key}`)
      .then((hasPolicies) =>
        hasPolicies ? { state: 'iam.policy.policies' } : false,
      ),
});

export default {
  name,
  state,
};
