import { TAG } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.dashboard.resourceGroups', {
    url: '/resourceGroups?cursors',
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
      breadcrumb: () => null,
      cursors: /* @ngInject */ ($transition$) => $transition$.params().cursors,
    },
    atInternet: {
      rename: TAG.RESOURCE_GROUPS,
    },
  });
};
