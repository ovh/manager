import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      netappContainer: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((services) =>
          services.data.length === 0
            ? {
                state: 'netapp.onboarding',
              }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/storage/netapp',
      dataModel: () => 'storage.NetAppService',
      defaultFilterColumn: () => 'id',
      header: () => 'NetApp',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ id }) =>
        $state.href('netapp.dashboard', {
          serviceName: id,
        }),
      schema: /* @ngInject */ ($http) =>
        $http.get('/storage.json').then(({ data }) => data),
      hideBreadcrumb: () => true,
    },
  });
};
