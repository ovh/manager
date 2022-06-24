import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      vpsContainer: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/vps',
      dataModel: () => 'vps.VPS',
      defaultFilterColumn: () => 'name',
      header: () => 'VPS',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.href('vps.detail', {
          serviceName,
        }),
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources?.data?.length > 0 ? false : 'vps.onboarding',
        );
    },
  });
};
