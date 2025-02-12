import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getVeeamOrderUrl } from './veeam.order';

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
      changelog: () => 'veeam_cloud_connect',
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('veeam-cloud-connect.detail', {
          serviceName,
        }),
      topbarOptions: /* @ngInject */ (
        $translate,
        $window,
        coreConfig,
        atInternet,
      ) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('veeam_cc_order'),
          value: $translate.instant('veeam_cc_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'veeam-cloud-connect::index::order',
              type: 'action',
            });
            $window.open(
              getVeeamOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
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
