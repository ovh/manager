import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nashas', {
    url: `/paas/nasha?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/dedicated/nasha',
      dataModel: () => 'dedicated.nasha.Storage',
      defaultFilterColumn: () => 'serviceName',
      header: () => 'NASHA',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: nashaId,
      }) =>
        $state.href('nasha.nasha-partitions', {
          nashaId,
        }),
    },
  });
};
