import { cursorsParamResolve } from '../../resolves';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy.policies', {
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
};
