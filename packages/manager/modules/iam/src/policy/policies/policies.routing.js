import { cursorsType } from '../../iam.paramTypes';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy.policies', {
    url: `?cursors`,
    component: 'iamPolicies',
    params: {
      cursors: {
        array: false,
        dynamic: true,
        inherit: false,
        squash: true,
        type: cursorsType,
        value: null,
      },
    },
    resolve: {
      breadcrumb: () => null,
      cursors: /* @ngInject */ ($transition$) => $transition$.params().cursors,
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
