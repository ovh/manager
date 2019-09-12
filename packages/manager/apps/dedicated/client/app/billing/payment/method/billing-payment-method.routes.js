angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.method';

    $stateProvider.state(name, {
      url: '/method',
      templateUrl: 'billing/payment/method/billing-payment-method.html',
      controller: 'BillingPaymentMethodCtrl',
      controllerAs: '$ctrl',
      translations: { value: ['./'], format: 'json' },
    });

    $urlRouterProvider.when(
      /^\/billing\/mean$/,
      ($location, $state) => $state.go(name),
    );
  });
