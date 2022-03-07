import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.index', {
    url: `/managedBaremetal?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      staticResources: () => true,
      apiPath: () => '/dedicatedCloud',
      dataModel: () => 'dedicatedCloud.dedicatedCloud',
      defaultFilterColumn: () => 'serviceName',
      resources: /* @ngInject */ ($http, apiPath) =>
        $http
          .get(apiPath, {
            headers: {
              'X-Pagination-Mode': 'CachedObjectList-Pages',
              'X-Pagination-Filter': 'productReference:eq=MBM',
            },
          })
          .then(({ data }) => data),
      header: /* @ngInject */ ($translate) =>
        $translate.instant('managed_baremetal_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: productId,
      }) =>
        $state.href('app.managedBaremetal.details.dashboard', {
          productId,
        }),
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length === 0 ? 'app.managedBaremetal.onboarding' : false,
        ),
  });
};
