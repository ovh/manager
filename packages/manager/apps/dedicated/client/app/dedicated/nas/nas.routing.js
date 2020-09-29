import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-nas.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      nasView: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/dedicated/nas',
      dataModel: () => 'dedicated.nas.Nas',
      defaultFilterColumn: () => 'serviceName',
      header: () => 'NAS',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: nasId,
      }) =>
        $state.href('app.dedicated-nas.details', {
          nasId,
          nasType: 'nas',
        }),
    },
  });
};
