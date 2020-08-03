import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas.metrics.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      dbaasContainer: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/metrics',
      dataModel: () => 'metrics.api.Service',
      defaultFilterColumn: () => 'name',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_metrics_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.href('dbaas.metrics.detail', {
          serviceName,
        }),
    },
  });
};
