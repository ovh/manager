const name = 'onboarding';

const state = () => ({
  url: '/onboarding',
  component: 'iamOnboarding',
  redirectTo: (transition) =>
    transition
      .injector()
      .getAsync('hasPolicies')
      .then((hasPolicies) =>
        hasPolicies ? { state: 'iam.policy.policies' } : false,
      ),
  resolve: {
    breadcrumb: () => null,
  },
});

export default {
  name,
  state,
};
