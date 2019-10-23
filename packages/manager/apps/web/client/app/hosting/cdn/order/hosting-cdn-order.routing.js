import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.cdn.order', {
    url: '/order',
    component: 'hostingCdnOrder',
    resolve: {
      autoPayWithPreferredPaymentMethod: /* @ngInject */
        ovhPaymentMethod => ovhPaymentMethod.hasDefaultPaymentMethod(),

      catalogAddon: /* @ngInject */ (
        goBack,
        serviceOption,
        user,
        $translate,
        HostingCdnOrderService,
      ) => HostingCdnOrderService
        .getCatalogAddon(user.ovhSubsidiary, serviceOption)
        .catch(error => goBack(
          $translate.instant('hosting_dashboard_cdn_order_error', { message: get(error, 'data.message', error) }),
          'danger',
        )),

      checkoutOrderCart: /* @ngInject */ (
        goBack,
        $translate,
        $window,
        HostingCdnOrderService,
      ) => async (
        autoPayWithPreferredPaymentMethod,
        cartId,
      ) => {
        try {
          const order = await HostingCdnOrderService
            .checkoutOrderCart(autoPayWithPreferredPaymentMethod, cartId);

          $window.open(order.url, '_blank');
          goBack(
            $translate.instant('hosting_dashboard_cdn_order_success', { t0: order.url }),
          );
        } catch (error) {
          goBack(
            $translate.instant('hosting_dashboard_cdn_order_error', { message: get(error, 'data.message', error) }),
            'danger',
          );
        }
      },

      defaultPaymentMean: /* @ngInject */
        ovhPaymentMethod => ovhPaymentMethod.getDefaultPaymentMethod(),

      goBack: /* @ngInject */ goToHosting => goToHosting,

      isOptionFree: /* @ngInject */ serviceOption => serviceOption.planCode === 'cdn_free_business',

      prepareOrderCart: /* @ngInject */ (
        goBack,
        serviceName,
        serviceOption,
        user,
        $translate,
        HostingCdnOrderService,
      ) => async () => {
        try {
          const cartId = await HostingCdnOrderService
            .prepareOrderCart(user.ovhSubsidiary);
          const cart = await HostingCdnOrderService
            .addItemToCart(cartId, serviceName, serviceOption);

          return { cart, cartId };
        } catch (error) {
          goBack(
            $translate.instant('hosting_dashboard_cdn_order_error', { message: get(error, 'data.message', error) }),
            'danger',
          );

          return {};
        }
      },

      serviceName: /* @ngInject */ $transition$ => $transition$.params().productId,

      serviceOption: /* @ngInject */ (
        goBack,
        serviceName,
        $translate,
        HostingCdnOrderService,
      ) => HostingCdnOrderService
        .getServiceOption(serviceName)
        .catch(error => goBack(
          $translate.instant('hosting_dashboard_cdn_order_error', { message: get(error, 'data.message', error) }),
          'danger',
        )),
    },
  });
};
