import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('metrics.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      metricsContainer: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/metrics',
      dataModel: () => 'metrics.api.Service',
      defaultFilterColumn: () => 'name',
      header: () => 'Metrics',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.href('metrics.detail', {
          serviceName,
        }),
      staticResources: () => true,
      resources: /* @ngInject */ ($http, $q, apiPath) =>
        $http.get(apiPath).then(({ data }) =>
          $q
            .all(
              data.map((id) =>
                $http
                  .get(`/metrics/${id}`)
                  .then((response) => response.data)
                  .catch(() => null),
              ),
            )
            .then((services) => services.filter((service) => !!service)),
        ),
      hideBreadcrumb: () => true,
    },
  });
};
