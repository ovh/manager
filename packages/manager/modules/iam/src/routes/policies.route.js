import { cursorsParamResolve } from '../resolves';

const name = 'policies';

const state = () => ({
  url: `?cursors`,
  component: 'iamPolicies',
  params: {
    cursors: cursorsParamResolve.declaration,
  },
  resolve: {
    breadcrumb: () => null,
    cursors: cursorsParamResolve,
  },
  redirectTo: (transition) =>
    transition
      .injector()
      .getAsync('hasPolicies')
      .then((hasPolicies) =>
        !hasPolicies ? { state: 'iam.onboarding' } : false,
      ),
});

export default {
  name,
  state,
};
