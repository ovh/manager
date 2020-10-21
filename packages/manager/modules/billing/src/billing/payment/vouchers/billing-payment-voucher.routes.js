angular.module('Billing').config(($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.billing.payment.vouchers';

  $stateProvider.state(name, {
    url: '/vouchers',
    templateUrl: 'billing/payment/vouchers/billing-vouchers.html',
    controller: 'Billing.controllers.Vouchers',
  });

  $urlRouterProvider.when(/^\/billing\/vouchers/, ($location, $state) =>
    $state.go(name),
  );
});
