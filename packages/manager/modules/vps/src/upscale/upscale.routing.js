import component from './upscale.component';
import vpsHeaderComponent from '../header/vps-header.component';
import { UPSCALE_TRACKING_PREFIX } from './upscale.constants';

export default /* @ngInject */ function($stateProvider) {
  $stateProvider.state('vps.detail.upscale', {
    url: '/upscale',
    resolve: {
      agreements: /* @ngInject */ (coreConfig, CORE_URLS) =>
        CORE_URLS.agreements[coreConfig.getRegion()],
      serviceInfos: /* @ngInject */ ($http, serviceName) =>
        $http.get(`/vps/${serviceName}/serviceInfos`).then(({ data }) => data),
      pricingRenewPeriod: /* @ngInject */ (serviceInfos) =>
        serviceInfos.renew?.period,
      getUpscaleInformation: /* @ngInject */ (
        serviceInfos,
        VpsUpgradeService,
        defaultPaymentMethod,
      ) => (plan) =>
        VpsUpgradeService.getUpgrade(
          serviceInfos.serviceId,
          plan,
          defaultPaymentMethod != null,
        ),
      getRebootLink: /* @ngInject */ ($state) => () =>
        $state.href('vps.detail.dashboard.reboot'),
      performUpscale: /* @ngInject */ (
        defaultPaymentMethod,
        serviceInfos,
        VpsUpgradeService,
      ) => (plan) =>
        VpsUpgradeService.startUpgrade(
          serviceInfos.serviceId,
          plan,
          defaultPaymentMethod != null,
        ),
      upscaleOptions: /* @ngInject */ (
        catalog,
        connectedUser,
        serviceInfos,
        stateVps,
        VpsUpgradeService,
      ) => {
        const current = catalog.plans.find(
          ({ planCode }) => planCode === stateVps.model.name,
        );
        return VpsUpgradeService.getAvailableUpgrades(
          serviceInfos.serviceId,
        ).then((data) => [
          ...data.map((option) => ({
            ...option,
            ...catalog.products.find(({ name }) => name === option.productName),
          })),
          {
            ...current,
            ...catalog.products.find(
              ({ name }) => name === stateVps.model.name,
            ),
            prices: current.pricings.map((price) => ({
              ...price,
              price: {
                currencyCode: connectedUser.currency.code,
              },
              pricingMode: price.mode,
              priceInUcents: price.price,
            })),
          },
        ]);
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_upscale_title'),
    },
    views: {
      'vpsHeader@vps': {
        component: vpsHeaderComponent.name,
      },
      'vpsContainer@vps': {
        component: component.name,
      },
    },
    translations: {
      value: ['./'],
      format: 'json',
    },
    atInternet: {
      rename: `${UPSCALE_TRACKING_PREFIX}1`,
    },
  });
}
