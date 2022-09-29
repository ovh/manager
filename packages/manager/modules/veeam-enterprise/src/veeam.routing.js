import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getVeeamOrderUrl } from './veeam.order';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('veeam-enterprise.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0
            ? { state: 'veeam-enterprise.onboarding' }
            : false,
        ),
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/veeam/veeamEnterprise',
      dataModel: () => 'veeam.veeamEnterprise.Account',
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) =>
        $translate.instant('veeam_enterprise_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('veeam-enterprise.details', {
          serviceName,
        }),
      topbarOptions: /* @ngInject */ ($translate, $window, coreConfig) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('veeam_enterprise_order'),
          value: $translate.instant('veeam_enterprise_order'),
          onClick: () => {
            $window.open(
              getVeeamOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
  });
};
