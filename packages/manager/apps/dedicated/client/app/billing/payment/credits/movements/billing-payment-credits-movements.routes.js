angular.module('Billing').config(($stateProvider, $urlServiceProvider) => {
  const name = 'app.account.billing.payment.credits.movements';

  $stateProvider.state(name, {
    url: '/:balanceName',
    templateUrl:
      'billing/payment/credits/movements/billing-credits-movements.html',
    controller: 'Billing.controllers.CreditsMovements',
    controllerAs: '$ctrl',
    resolve: {
      balanceName: /* @ngInject */ ($transition$) =>
        $transition$.params().balanceName,
      breadcrumb: /* @ngInject */ (balanceName) => balanceName,
    },
  });

  $urlServiceProvider.rules.when(
    '/billing/payment/credits/movements/:name',
    '/billing/payment/credits/:name',
  );
});
