import component from './domain-webhosting-order.component';

const resolve = {
  assignCart: /* @ngInject */ (WucOrderCartService) => (cartId) =>
    WucOrderCartService.assignCart(cartId),
  /* @ngInject */
  availableModules: (cartId, WebHostingOrder) =>
    WebHostingOrder.getAvailableModules(cartId),
  availableOffers: /* @ngInject */ (cartId, user, WebHostingOrder) =>
    WebHostingOrder.getAvailableOffers(cartId, user.ovhSubsidiary),
  cartId: /* @ngInject */ (assignCart, createCart) =>
    createCart().then(({ cartId }) => assignCart(cartId).then(() => cartId)),
  createCart: /* @ngInject */ (WucOrderCartService, user) => () =>
    WucOrderCartService.createNewCart(user.ovhSubsidiary),
  defaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
    ovhPaymentMethod.getDefaultPaymentMethod(),
  deleteCartItems: /* @ngInject */ (cartId, WucOrderCartService) => () =>
    WucOrderCartService.deleteAllItems(cartId),
  displayErrorMessage: /* @ngInject */ ($translate, Alerter) => (
    translationId,
  ) =>
    Alerter.error($translate.instant(translationId), 'webhosting-order-alert'),
  displayOrderBillSuccessMessage: /* @ngInject */ ($translate, Alerter) => (
    billUrl,
  ) =>
    Alerter.success(
      $translate.instant('domain_webhosting_order_bill_success', {
        billUrl,
      }),
      'domain_alert_main',
    ),
  displayPayCheckoutSuccessMessage: /* @ngInject */ ($translate, Alerter) => (
    accountId,
    billUrl,
    price,
    renewDate,
  ) =>
    Alerter.success(
      $translate.instant('domain_webhosting_order_payment_checkout_success', {
        accountId,
        billUrl,
        price,
        renewDate,
      }),
      'domain_alert_main',
    ),
  openBill: /* @ngInject */ ($window) => (billUrl) =>
    $window.open(billUrl, '_blank'),
  /* @ngInject */
  prepareCheckout: (WebHostingOrder) => (cartId, cartOption, domainName) =>
    WebHostingOrder.prepareCheckout(cartId, cartOption, domainName),
  validateCheckout: /* @ngInject */ (
    $timeout,
    defaultPaymentMethod,
    displayErrorMessage,
    displayOrderBillSuccessMessage,
    displayPayCheckoutSuccessMessage,
    domain,
    goBackToDashboard,
    openBill,
    WebHostingOrder,
  ) => (cartId, checkoutToPay) =>
    WebHostingOrder.validateCheckout(cartId, checkoutToPay)
      .then((checkout) =>
        goBackToDashboard().then(() => {
          if (checkoutToPay.autoPayWithPreferredPaymentMethod) {
            return displayPayCheckoutSuccessMessage(
              defaultPaymentMethod.label,
              checkout.url,
              checkout.prices.withTax.text,
              moment(domain.expiration)
                .add(1, 'days')
                .format('DD/MM/YYYY'),
            );
          }
          displayOrderBillSuccessMessage(checkout.url);
          return openBill(checkout.url);
        }),
      )
      .catch(() => {
        displayErrorMessage('domain_webhosting_order_payment_checkout_error');
      }),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.domain.product.webhosting.order', {
      url: '/order',
      views: {
        'domainView@app.domain.product': {
          component: component.name,
        },
      },
      resolve: {
        ...resolve,
        goBackToDashboard: /* @ngInject */ ($state) => () =>
          $state.go('app.domain.product.information'),
      },
    })
    .state('app.domain.alldom.webhosting.order', {
      url: '/order',
      views: {
        'domainView@app.domain.alldom': {
          component: component.name,
        },
      },
      resolve: {
        ...resolve,
        goBackToDashboard: /* @ngInject */ ($state) => () =>
          $state.go('app.domain.alldom.information'),
      },
    });
};
