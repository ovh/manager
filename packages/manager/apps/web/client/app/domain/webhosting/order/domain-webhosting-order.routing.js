import component from './domain-webhosting-order.component';

const resolve = {
  alertCheckoutError: /* @ngInject */ (
    $translate,
    Alerter,
  ) => translationId => Alerter.error($translate.instant(translationId), 'webhosting-order-alert'),
  assignCart: /* @ngInject */ OrderService => cartId => OrderService
    .assignCart(cartId),
  availableModules: /* @ngInject */
    (cartId, WebHostingOrder) => WebHostingOrder
      .getAvailableModules(cartId),
  availableOffers: /* @ngInject */ (
    cartId,
    user,
    WebHostingOrder,
  ) => WebHostingOrder.getAvailableOffers(cartId, user.ovhSubsidiary),
  cartId: /* @ngInject */ (
    assignCart,
    createCart,
  ) => createCart()
    .then(({ cartId }) => assignCart(cartId).then(() => cartId)),
  createCart: /* @ngInject */ (
    OrderService,
    user,
  ) => () => OrderService
    .createNewCart(user.ovhSubsidiary),
  defaultPaymentMean: /* @ngInject */
    ovhPaymentMethod => ovhPaymentMethod.getDefaultPaymentMethod(),
  deleteCartItems: /* @ngInject */ (cartId, OrderService) => () => OrderService
    .deleteAllItems(cartId),
  displayOrderBillSuccessMessage: /* @ngInject */ (
    $translate,
    Alerter,
  ) => billUrl => Alerter.success($translate.instant('domain_webhosting_order_bill_success', {
    billUrl,
  }), 'domain_alert_main'),
  displayPayCheckoutSuccessMessage: /* @ngInject */ (
    $translate,
    Alerter,
  ) => (
    accountId,
    billUrl,
    price,
    renewDate,
  ) => Alerter.success($translate.instant('domain_webhosting_order_payment_checkout_success', {
    accountId,
    billUrl,
    price,
    renewDate,
  }), 'domain_alert_main'),
  openBill: /* @ngInject */ $window => billUrl => $window.open(billUrl, '_blank'),
  prepareCheckout: /* @ngInject */
    WebHostingOrder => (cartId, cartOption, domainName) => WebHostingOrder
      .prepareCheckout(cartId, cartOption, domainName),
  validateCheckout: /* @ngInject */ (
    $timeout,
    alertCheckoutError,
    defaultPaymentMean,
    displayOrderBillSuccessMessage,
    displayPayCheckoutSuccessMessage,
    domain,
    goBackToDashboard,
    openBill,
    WebHostingOrder,
  ) => (cartId, checkoutToPay) => WebHostingOrder
    .validateCheckout(cartId, checkoutToPay)
    .catch(() => { alertCheckoutError('domain_webhosting_order_payment_checkout_error'); })
    .then(checkout => goBackToDashboard()
      .then(() => {
        if (checkoutToPay.autoPayWithPreferredPaymentMethod) {
          return displayPayCheckoutSuccessMessage(
            defaultPaymentMean.label,
            checkout.url,
            checkout.prices.withTax.text,
            moment(domain.expiration).add(1, 'days').format('DD/MM/YYYY'),
          );
        }
        displayOrderBillSuccessMessage(checkout.url);
        return openBill(checkout.url);
      })),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.domain.product.webhosting.order', {
      url: '/order',
      views: {
        'webhostingView@app.domain.product.webhosting': {
          component: component.name,
        },
      },
      resolve: Object.assign(
        {},
        resolve,
        { goBackToDashboard: /* @ngInject */ $state => () => $state.go('app.domain.product.information') },
      ),
    })
    .state('app.domain.alldom.webhosting.order', {
      url: '/order',
      views: {
        'webhostingView@app.domain.alldom.webhosting': {
          component: component.name,
        },
      },
      resolve: Object.assign(
        {},
        resolve,
        { goBackToDashboard: /* @ngInject */ $state => () => $state.go('app.domain.alldom.information') },
      ),
    });
};
