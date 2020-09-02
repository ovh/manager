import component from './upscale.component';
import vpsHeaderComponent from '../header/vps-header.component';

export default /* @ngInject */ function($stateProvider) {
  $stateProvider.state('vps.detail.upscale', {
    url: '/upscale',
    resolve: {
      agreements: /* @ngInject */ (coreConfig, CORE_URLS) =>
        CORE_URLS.agreements[coreConfig.getRegion()],
      getUpscaleInformation: /* @ngInject */ (serviceName, vpsUpgrade) => (
        planCode,
      ) =>
        vpsUpgrade.getUpgrade(serviceName, planCode, {
          quantity: 1,
        }),
      performUpscale: /* @ngInject */ (
        defaultPaymentMethod,
        serviceName,
        vpsUpgrade,
      ) => (planCode) =>
        vpsUpgrade.startUpgrade(serviceName, planCode, {
          autoPayWithPreferredPaymentMethod: defaultPaymentMethod != null,
          quantity: 1,
        }),
      upscaleOptions: /* @ngInject */ ($http, catalog, serviceName) =>
        $http.get(`/order/upgrade/vps/${serviceName}`).then(({ data }) =>
          data.map((option) => ({
            ...option,
            ...catalog.products.find(({ name }) => name === option.planCode),
          })),
        ),
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
  });
}
