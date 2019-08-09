angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.refunds';

    $stateProvider.state(name, {
      url: '/refunds',
      templateUrl: 'account/billing/payment/refunds/billing-refunds.html',
      controller: 'Billing.controllers.Refunds',
    });

    $urlRouterProvider.when(
      /^\/billing\/refunds/,
      ($location, $state) => $state.go(name),
    );
  });
