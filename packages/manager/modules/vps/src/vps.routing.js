import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getVpsOrderUrl } from './vps-order';
import { VPS_GUIDES } from './vps.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    views: {
      vpsContainer: 'ovhManagerVpsList',
      vpsHeader: {
        component: 'ovhManagerAutoRenew2016DeploymentBanner',
        bindings: {
          show: 'isAutorenew2016DeploymentBannerAvailable',
        },
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/vps',
      dataModel: () => 'vps.VPS',
      defaultFilterColumn: () => 'name',
      header: /* @ngInject */ ($translate) => $translate.instant('vps_title'),
      changelog: () => 'vps',
      guides: /* @ngInject */ ($translate, coreConfig) =>
        VPS_GUIDES.map((guide) => ({
          title: $translate.instant(guide.translateKey),
          href:
            guide.url[coreConfig.getUser().ovhSubsidiary] || guide.url.DEFAULT,
        })),
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({ name: serviceName }) =>
        $state.href('vps.detail', {
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
          label: $translate.instant('vps_common_order'),
          value: $translate.instant('vps_common_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'vps::index::order',
              type: 'action',
            });
            $window.open(
              getVpsOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
      isAutorenew2016DeploymentBannerAvailable: /* @ngInject */ (
        ovhFeatureFlipping,
      ) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('billing:autorenew2016Deployment')
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(
              'billing:autorenew2016Deployment',
            ),
          ),
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
