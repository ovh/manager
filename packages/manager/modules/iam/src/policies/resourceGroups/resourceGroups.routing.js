import { TAG } from '../../iam.constants';

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
      rename: TAG.RESOURCE_GROUPS,
    },
  });
};
