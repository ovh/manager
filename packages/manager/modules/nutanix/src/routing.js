import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.index', {
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
                state: 'nutanix.onboarding',
              }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/nutanix',
      schema: /* @ngInject */ ($http) =>
        $http.get('/nutanix.json').then(({ data }) => data),
      dataModel: () => 'nutanix.cluster',
      defaultFilterColumn: () => 'serviceName',
      header: () => 'nutanix',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('nutanix.dashboard', {
          serviceName,
        }),
      hideBreadcrumb: () => true,
    },
  });
};
