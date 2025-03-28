import { RESOURCE_GROUPS_TRACKING_HITS } from './resourceGroups.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies.resourceGroups', {
    url: '/resource-groups?cursors',
    component: 'iamResourceGroups',
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
        $translate.instant('iam_policies_resource_groups'),
      cursors: /* @ngInject */ ($transition$) => $transition$.params().cursors,
    },
    atInternet: {
      rename: RESOURCE_GROUPS_TRACKING_HITS.LISTING_PAGE,
    },
  });
};
