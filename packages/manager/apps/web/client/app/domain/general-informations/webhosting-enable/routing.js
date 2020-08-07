const commonResolves = {
  cart: /* @ngInject */ (user, WucOrderCartService) =>
    WucOrderCartService.createNewCart(user.ovhSubsidiary).then((cart) =>
      WucOrderCartService.assignCart(cart.cartId).then(() => cart),
    ),
  addOption: /* @ngInject */ (cart, domainName, WebhostingEnableService) => (
    item,
    offer,
    configuration,
  ) =>
    WebhostingEnableService.updateOption(
      cart,
      item,
      domainName,
      offer,
      configuration,
    ),
  defaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
    ovhPaymentMethod.getDefaultPaymentMethod(),

  getCheckout: /* @ngInject */ (cart, WucOrderCartService) => () =>
    WucOrderCartService.getCheckoutInformations(cart.cartId),

  order: /* @ngInject */ (
    cart,
    defaultPaymentMethod,
    WucOrderCartService,
  ) => () =>
    WucOrderCartService.checkoutCart(cart.cartId, {
      autoPayWithPreferredPaymentMethod: !!defaultPaymentMethod,
      waiveRetractationPeriod: true,
    }),
  goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.information.enable-webhosting', {
    url: '/webhosting-enable',
    component: 'domainWebhostingEnable',
    resolve: commonResolves,
  });

  $stateProvider.state('app.alldom.domain.information.enable-webhosting', {
    url: '/webhosting-enable',
    component: 'domainWebhostingEnable',
    resolve: commonResolves,
  });
};
