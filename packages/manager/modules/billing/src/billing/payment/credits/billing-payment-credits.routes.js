angular.module('Billing').config(($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.billing.payment.credits';

  $stateProvider.state(name, {
    url: '/credits',
    templateUrl: 'billing/payment/credits/billing-credits.html',
    controller: 'Billing.controllers.Credits',
    controllerAs: '$ctrl',
  });

  $urlRouterProvider.when(/^\/billing\/credits/, ($location, $state) =>
    $state.go(name),
  );
});
