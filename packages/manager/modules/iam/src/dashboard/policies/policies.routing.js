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

    // TODO: commented for now, remove when working on policies pages MANAGER-16217
    // redirectTo: (transition) =>
    //   transition
    //     .injector()
    //     .getAsync('hasPolicies')
    //     .then((hasPolicies) =>
    //       !hasPolicies ? { state: 'iam.onboarding' } : false,
    //     ),
    atInternet: {
      rename: TAG.POLICIES,
    },
  });
};
