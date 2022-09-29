import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getVpsOrderUrl } from './vps-order';

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
      header: /* @ngInject */ ($translate) => $translate.instant('vps_title'),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.href('vps.detail', {
          serviceName,
        }),
      topbarOptions: /* @ngInject */ ($translate, $window, coreConfig) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('vps_common_order'),
          value: $translate.instant('vps_common_order'),
          onClick: () => {
            $window.open(
              getVpsOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
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
