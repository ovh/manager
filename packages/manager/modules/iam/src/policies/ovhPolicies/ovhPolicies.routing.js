import { TAG } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies.ovhPolicies', {
    url: '/ovhPolicies?cursors',
    component: 'iamOvhPolicies',
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
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_policies_ovh'),
      cursors: /* @ngInject */ ($transition$) => $transition$.params().cursors,
    },
    atInternet: {
      rename: TAG.POLICIES,
    },
  });
};
