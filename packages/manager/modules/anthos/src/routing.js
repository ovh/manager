import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((services) =>
          services.length === 0
            ? {
                state: 'anthos.onboarding',
              }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/dedicated/anthos/tenants',
      schema: /* @ngInject */ ($http) =>
        $http.get('/dedicated/anthos.json').then(({ data }) => data),
      dataModel: () => 'dedicated.anthos.Tenant',
      defaultFilterColumn: () => 'serviceName',
      header: () => 'anthos',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('anthos.dashboard', {
          serviceName,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
