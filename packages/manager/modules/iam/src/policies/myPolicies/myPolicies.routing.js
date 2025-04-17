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
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_policies_my_policies'),
      cursors: /* @ngInject */ ($transition$) => $transition$.params().cursors,
    },
    atInternet: {
      rename: MY_POLICIES_TRACKING_HITS.LISTING_PAGE,
    },
  });
};
