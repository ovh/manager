import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length === 0
            ? { state: 'app.dedicatedCloud.onboarding' }
            : false,
        ),
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
              'X-Pagination-Filter': 'productReference:eq=EPCC',
            },
          })
          .then(({ data }) => data),
      header: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_clouds_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: productId,
      }) =>
        $state.href('app.dedicatedCloud.details.dashboard', {
          productId,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
