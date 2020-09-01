import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('veeams-enterprise', {
    url: `/paas/veeam-enterprise?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/veeam/veeamEnterprise',
      dataModel: () => 'veeam.veeamEnterprise.Account',
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('veeam_enterprise_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('veeam-enterprise', {
          serviceName,
        }),
    },
  });
};
