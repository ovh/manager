import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.database.order-private', {
    url: '/order-private',
    component: 'hostingDatabaseOrderPrivate',
    resolve: {
      /* @ngInject */
      autoPayWithPreferredPaymentMethod: (ovhPaymentMethod) =>
        ovhPaymentMethod.hasDefaultPaymentMethod(),

      cartId: /* @ngInject */ (user, HostingDatabaseOrderPrivateService) =>
        HostingDatabaseOrderPrivateService.prepareOrderCart(user.ovhSubsidiary),

      catalogProducts: /* @ngInject */ (
        goBack,
        products,
        user,
        $translate,
        HostingDatabaseOrderPrivateService,
      ) =>
        HostingDatabaseOrderPrivateService.getCatalogProducts(
          user.ovhSubsidiary,
          products,
        ).catch((error) =>
          goBack(
            $translate.instant('hosting_database_order_private_error', {
              message: get(error, 'data.message', error),
            }),
            'danger',
          ),
        ),

      checkoutOrderCart: /* @ngInject */ (
        goBack,
        $translate,
        $window,
        HostingDatabaseOrderPrivateService,
      ) => async (autoPayWithPreferredPaymentMethod, cartId) => {
        try {
          const order = await HostingDatabaseOrderPrivateService.checkoutOrderCart(
            autoPayWithPreferredPaymentMethod,
            cartId,
          );

          $window.open(order.url, '_blank');
          goBack(
            $translate.instant('hosting_database_order_private_success', {
              t0: order.url,
            }),
          );
        } catch (error) {
          goBack(
            $translate.instant('hosting_database_order_private_error', {
              message: get(error, 'data.message', error),
            }),
            'danger',
          );
        }
      },

      datacenter: /* @ngInject */ (
        serviceName,
        HostingDatabaseOrderPrivateService,
      ) => HostingDatabaseOrderPrivateService.getDatacenter(serviceName),

      /* @ngInject */
      defaultPaymentMean: (ovhPaymentMethod) =>
        ovhPaymentMethod.getDefaultPaymentMethod(),

      /* @ngInject */
      getDatacenter: (HostingDatabaseOrderPrivateService) => (serviceName) =>
        HostingDatabaseOrderPrivateService.getDatacenter(serviceName),

      goBack: /* @ngInject */ (goToHosting) => goToHosting,

      prepareOrderCart: /* @ngInject */ (
        cartId,
        goBack,
        $translate,
        HostingDatabaseOrderPrivateService,
      ) => async (datacenter, price, product, version) => {
        try {
          const cart = await HostingDatabaseOrderPrivateService.addItemToCart(
            cartId,
            datacenter,
            price,
            product,
            version,
          );

          return { cart, cartId };
        } catch (error) {
          goBack(
            $translate.instant('hosting_database_order_private_error', {
              message: get(error, 'data.message', error),
            }),
            'danger',
          );

          return {};
        }
      },

      products: /* @ngInject */ (
        cartId,
        goBack,
        serviceName,
        $translate,
        HostingDatabaseOrderPrivateService,
      ) =>
        HostingDatabaseOrderPrivateService.getProducts(
          cartId,
          serviceName,
        ).catch((error) =>
          goBack(
            $translate.instant('hosting_database_order_private_error', {
              message: get(error, 'data.message', error),
            }),
            'danger',
          ),
        ),

      resetOrderCart: /* @ngInject */ (
        cartId,
        HostingDatabaseOrderPrivateService,
      ) => () => HostingDatabaseOrderPrivateService.resetOrderCart(cartId),

      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,

      /* @ngInject */
      services: (HostingDatabaseOrderPrivateService) =>
        HostingDatabaseOrderPrivateService.getServices(),
    },
  });
};
