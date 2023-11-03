import { TAG } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.dashboard.policies', {
    url: '/policies?cursors',
    component: 'iamPolicies',
    params: {
      cursors: {
        array: false,
        dynamic: true,
        inherit: false,
        squash: true,
        type: 'cursors',
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
    atInternet: {
      rename: TAG.POLICIES,
    },
  });
};
