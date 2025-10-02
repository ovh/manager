import { MY_POLICIES_TRACKING_HITS } from './myPolicies.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies.myPolicies', {
    url: '/myPolicies?cursors',
    component: 'iamMyPolicies',
    params: {
      cursors: {
        array: false,
        dynamic: true,
        inherit: false,
        squash: true,
        type: 'cursors',
        value: null,
      },
      identitiesCriteria: {
        array: true,
        value: [],
      },
      resourcesCriteria: {
        array: true,
        value: [],
      },
      actionsCriteria: {
        array: true,
        value: [],
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_policies_my_policies'),
      cursors: /* @ngInject */ ($transition$) => $transition$.params().cursors,
      identitiesCriteria: /* @ngInject */ ($transition$) =>
        $transition$.params().identitiesCriteria,
      resourcesCriteria: /* @ngInject */ ($transition$) =>
        $transition$.params().resourcesCriteria,
      actionsCriteria: /* @ngInject */ ($transition$) =>
        $transition$.params().actionsCriteria,
    },
    atInternet: {
      rename: MY_POLICIES_TRACKING_HITS.LISTING_PAGE,
    },
  });
};
