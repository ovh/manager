import find from 'lodash/find';
import get from 'lodash/get';

import {
  HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BASIC_FREE,
  HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS_FREE,
  HOSTING_CDN_ORDER_CDN_VERSION_V1,
  HOSTING_CDN_ORDER_CDN_VERSION_V2,
} from './hosting-cdn-order.constant';

export default /* @ngInject */ ($stateProvider) => {
  const resolve = {
    autoPayWithPreferredPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
      ovhPaymentMethod.hasDefaultPaymentMethod(),

    isAutoPayable: /* @ngInject */ (
      autoPayWithPreferredPaymentMethod,
      isOptionFree,
    ) => (defaultPaymentChoose) =>
      defaultPaymentChoose ||
      (autoPayWithPreferredPaymentMethod && isOptionFree),

    catalogAddons: /* @ngInject */ (user, WucOrderCartService) =>
      WucOrderCartService.getProductPublicCatalog(
        user.ovhSubsidiary,
        'webHosting',
      ),

    catalogAddon: /* @ngInject */ (
      goBackWithError,
      serviceOption,
      user,
      $translate,
      HostingCdnOrderService,
    ) =>
      HostingCdnOrderService.getCatalogAddon(
        user.ovhSubsidiary,
        serviceOption,
      ).catch((error) => goBackWithError(get(error, 'data.message', error))),

    goBack: /* @ngInject */ (goToHosting) => goToHosting,

    goBackWithError: /* @ngInject */ ($translate, goBack) => (error) =>
      goBack(
        $translate.instant('hosting_dashboard_cdn_order_error', {
          message: error,
        }),
        'danger',
      ),

    isOptionFree: /* @ngInject */ (serviceOption) =>
      serviceOption.planCode ===
        HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BASIC_FREE ||
      serviceOption.planCode ===
        HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS_FREE,

    serviceName: /* @ngInject */ ($transition$) =>
      $transition$.params().productId,

    serviceOption: /* @ngInject */ (availableOptions, goBackWithError) =>
      find(availableOptions, { family: 'cdn' }) ||
      goBackWithError('No serviceOption found'),

    serviceInfo: /* @ngInject */ (Hosting, serviceName) =>
      Hosting.getServiceInfos(serviceName),

    cdnProperties: /* @ngInject */ (
      HostingCdnSharedService,
      serviceName,
      goBack,
    ) => {
      return HostingCdnSharedService.getCDNProperties(serviceName)
        .then(({ data: cdn }) => {
          if (cdn.version === HOSTING_CDN_ORDER_CDN_VERSION_V2) goBack();
          return cdn;
        })
        .catch(() => null);
    },

    hasCDN: /* @ngInject */ (cdnProperties) => cdnProperties !== null,

    isV1CDN: /* @ngInject */ (cdnProperties, hasCDN) =>
      hasCDN && cdnProperties.version === HOSTING_CDN_ORDER_CDN_VERSION_V1,

    isIncludedCDN: /* @ngInject */ (cdnProperties, isV1CDN) =>
      isV1CDN && cdnProperties.free,

    isPayableCDN: /* @ngInject */ (cdnProperties, isV1CDN) =>
      isV1CDN && !cdnProperties.free,

    isV2CDN: /* @ngInject */ (cdnProperties, hasCDN) =>
      hasCDN && cdnProperties.version === HOSTING_CDN_ORDER_CDN_VERSION_V2,

    cdnCase: /* @ngInject */ (isIncludedCDN, isPayableCDN, hasCDN) => {
      if (isIncludedCDN) {
        return 'included';
      }
      if (isPayableCDN) {
        return 'payable';
      }
      if (!hasCDN) {
        return 'without';
      }
      return null;
    },

    trackClick: /* @ngInject */ (atInternet) => (hit) => {
      atInternet.trackClick({
        name: hit,
        type: 'action',
      });
    },
  };
  const resolveOrder = {
    prepareCart: /* @ngInject */ (
      goBackWithError,
      serviceName,
      serviceOption,
      user,
      $translate,
      HostingCdnOrderService,
    ) => () => {
      const data = { cartId: null };
      return HostingCdnOrderService.prepareOrderCart(user.ovhSubsidiary)
        .then((cartId) => {
          data.cartId = cartId;
          return HostingCdnOrderService.addItemToCart(
            cartId,
            serviceName,
            serviceOption,
          );
        })
        .then((cart) => {
          return { cart, cartId: data.cartId };
        })
        .catch((error) => goBackWithError(get(error, 'data.message', error)));
    },

    checkoutCart: /* @ngInject */ (
      goBack,
      goBackWithError,
      isOptionFree,
      $translate,
      $window,
      HostingCdnOrderService,
    ) => (autoPayWithPreferredPaymentMethod, cartId) => {
      return HostingCdnOrderService.checkoutOrderCart(
        autoPayWithPreferredPaymentMethod,
        cartId,
      )
        .then((order) => {
          const message =
            isOptionFree || autoPayWithPreferredPaymentMethod
              ? $translate.instant(
                  'hosting_dashboard_cdn_order_success_activation',
                )
              : $translate.instant('hosting_dashboard_cdn_v2_order_success', {
                  t0: order.url,
                });
          return goBack(message);
        })
        .catch((error) => goBackWithError(get(error, 'data.message', error)));
    },
  };
  const resolveUpgrade = {
    prepareCart: /* @ngInject */ (
      goBackWithError,
      serviceName,
      HostingCdnOrderService,
      HostingCdnSharedService,
    ) => () => {
      return HostingCdnSharedService.simulateUpgrade(
        serviceName,
      ).catch((error) => goBackWithError(get(error, 'data.message', error)));
    },

    autoPayFreeOffer: /* @ngInject */ (OvhApiMe) => ({ orderId }) =>
      OvhApiMe.Order()
        .v6()
        .payRegisteredPaymentMean(
          { orderId },
          { paymentMean: 'fidelityAccount' },
        ).$promise,

    checkoutCart: /* @ngInject */ (
      $q,
      $translate,
      goBack,
      goBackWithError,
      isAutoPayable,
      isOptionFree,
      autoPayFreeOffer,
      HostingCdnSharedService,
    ) => (autoPayWithPreferredPaymentMethod, serviceOption, serviceId) => {
      const data = { order: null };
      return HostingCdnSharedService.upgradeToSharedCDN(
        isAutoPayable(autoPayWithPreferredPaymentMethod),
        serviceOption,
        serviceId,
      )
        .then(({ data: upgrade }) => {
          data.order = upgrade.order;
          return isOptionFree ? autoPayFreeOffer(upgrade.order) : $q.resolve();
        })
        .then(() => {
          const message =
            isOptionFree || autoPayWithPreferredPaymentMethod
              ? $translate.instant(
                  'hosting_dashboard_cdn_upgrade_included_success',
                )
              : $translate.instant('hosting_dashboard_cdn_v2_order_success', {
                  t0: data.order.url,
                });
          return goBack(message);
        })
        .catch((error) => goBackWithError(get(error, 'data.message', error)));
    },
  };
  const atInternet = {
    rename: 'web::hosting::cdn::order',
  };

  $stateProvider.state('app.hosting.dashboard.cdn.order', {
    url: '/order',
    component: 'hostingCdnOrder',
    resolve: { ...resolve, ...resolveOrder },
    atInternet,
  });

  $stateProvider.state('app.hosting.dashboard.cdn.upgrade', {
    url: '/upgrade',
    component: 'hostingCdnOrder',
    resolve: { ...resolve, ...resolveUpgrade },
    atInternet,
  });
};
