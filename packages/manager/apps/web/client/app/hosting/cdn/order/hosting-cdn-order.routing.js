import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';

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
    ) => async () => {
      try {
        const cartId = await HostingCdnOrderService.prepareOrderCart(
          user.ovhSubsidiary,
        );

        const cart = await HostingCdnOrderService.addItemToCart(
          cartId,
          serviceName,
          serviceOption,
        );

        return { cart, cartId };
      } catch (error) {
        goBackWithError(get(error, 'data.message', error));
        return {};
      }
    },

    checkoutCart: /* @ngInject */ (
      goBack,
      goBackWithError,
      isOptionFree,
      $translate,
      $window,
      HostingCdnOrderService,
    ) => async (autoPayWithPreferredPaymentMethod, cartId) => {
      try {
        const order = await HostingCdnOrderService.checkoutOrderCart(
          autoPayWithPreferredPaymentMethod,
          cartId,
        );

        if (isOptionFree || autoPayWithPreferredPaymentMethod) {
          return goBack(
            $translate.instant(
              'hosting_dashboard_cdn_order_success_activation',
            ),
          );
        }

        return goBack(
          $translate.instant('hosting_dashboard_cdn_v2_order_success', {
            t0: order.url,
          }),
        );
      } catch (error) {
        return goBackWithError(get(error, 'data.message', error));
      }
    },
  };
  const resolveUpgrade = {
    prepareCart: /* @ngInject */ (
      goBackWithError,
      serviceName,
      serviceOption,
      user,
      $translate,
      HostingCdnOrderService,
      HostingCdnSharedService,
    ) => async () => {
      try {
        const { data: servInfo } = await HostingCdnSharedService.getServiceInfo(
          serviceName,
        );
        const {
          data: servOpts,
        } = await HostingCdnSharedService.getServiceOptions(servInfo.serviceId);
        const { serviceId } = find(
          servOpts,
          ({ billing }) =>
            billing.plan.code.match('^cdn') &&
            billing.plan.code.match('_business$'),
        );
        const {
          data: addonPlans,
        } = await HostingCdnSharedService.getCatalogAddonsPlan(serviceId);
        const addonPlan = find(addonPlans, ({ planCode }) =>
          includes(['cdn-basic', 'cdn-basic-free'], planCode),
        );

        const { data } = await HostingCdnOrderService.simulateCartForUpgrade(
          serviceName,
          addonPlan,
          serviceId,
        );

        return { cart: data.order, addonPlan, serviceId };
      } catch (error) {
        goBackWithError(get(error, 'data.message', error));
        return {};
      }
    },

    autoPayFreeOffer: /* @ngInject */ (OvhApiMe) => ({ orderId }) =>
      OvhApiMe.Order()
        .v6()
        .payRegisteredPaymentMean(
          { orderId },
          { paymentMean: 'fidelityAccount' },
        ).$promise,

    checkoutCart: /* @ngInject */ (
      goBack,
      goBackWithError,
      isOptionFree,
      $translate,
      HostingCdnOrderService,
      isAutoPayable,
      autoPayFreeOffer,
    ) => async (autoPayWithPreferredPaymentMethod, addonPlan, serviceId) => {
      try {
        const {
          data,
        } = await HostingCdnOrderService.checkoutOrderCartForUpgrade(
          isAutoPayable(autoPayWithPreferredPaymentMethod),
          addonPlan,
          serviceId,
        );

        if (isOptionFree) {
          await autoPayFreeOffer(data.order);
        }

        if (isOptionFree || autoPayWithPreferredPaymentMethod) {
          return goBack(
            $translate.instant(
              'hosting_dashboard_cdn_upgrade_included_success',
            ),
          );
        }

        return goBack(
          $translate.instant('hosting_dashboard_cdn_v2_order_success', {
            t0: data.order.url,
          }),
        );
      } catch (error) {
        return goBackWithError(get(error, 'data.message', error));
      }
    },
  };
  const atInternet = {
    rename: 'web::hosting::cdn::order',
  };

  $stateProvider.state('app.hosting.cdn.order', {
    url: '/order',
    component: 'hostingCdnOrder',
    resolve: { ...resolve, ...resolveOrder },
    atInternet,
  });

  $stateProvider.state('app.hosting.cdn.upgrade', {
    url: '/upgrade',
    component: 'hostingCdnOrder',
    resolve: { ...resolve, ...resolveUpgrade },
    atInternet,
  });
};
