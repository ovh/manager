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
      identitiesFilter: {
        array: true,
        value: [],
      },
      resourcesFilter: {
        array: true,
        value: [],
      },
      actionsFilter: {
        array: true,
        value: [],
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_policies_my_policies'),
      cursors: /* @ngInject */ ($transition$) => $transition$.params().cursors,
      identitiesFilter: /* @ngInject */ ($transition$) =>
        $transition$.params().identitiesFilter,
      resourcesFilter: /* @ngInject */ ($transition$) =>
        $transition$.params().resourcesFilter,
      actionsFilter: /* @ngInject */ ($transition$) =>
        $transition$.params().actionsFilter,
    },
    atInternet: {
      rename: MY_POLICIES_TRACKING_HITS.LISTING_PAGE,
    },
  });
};
