angular.module('Billing').config(($stateProvider) => {
  const name = 'app.account.billing.payment.credits.movements';

  $stateProvider.state(name, {
    url: '/movements/:balanceName',
    templateUrl:
      'billing/payment/credits/movements/billing-credits-movements.html',
    controller: 'Billing.controllers.CreditsMovements',
    controllerAs: '$ctrl',
  });
});
