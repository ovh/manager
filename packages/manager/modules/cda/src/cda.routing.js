import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      cdaDetails: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/dedicated/ceph',
      dataModel: () => 'dedicated.ceph.clusterGet.response',
      defaultFilterColumn: () => 'serviceName',
      header: () => 'Ceph Cluster',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('cda.dashboard', {
          serviceName,
        }),
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? 'cda.onboarding' : false,
        ),
  });
};
