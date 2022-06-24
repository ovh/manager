import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('veeam-cloud-connect.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      veeamContainer: {
        component: 'managerListLayout',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/veeamCloudConnect',
      dataModel: () => 'veeamCloudConnect.Account',
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('veeam_cc_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('veeam-cloud-connect.detail', {
          serviceName,
        }),
      hideBreadcrumb: /* @ngInject */ () => true,
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('resources')
        .then((resources) => {
          return resources.data.length === 0
            ? 'veeam-cloud-connect.onboarding'
            : false;
        });
    },
  });
};
