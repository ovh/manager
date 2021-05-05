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
      totalAmount: /* @ngInject */ (balanceName, iceberg) =>
        iceberg(`/me/credit/balance/${balanceName}/movement`)
          .query()
          .expand('CachedObjectList-Pages')
          .limit(5000)
          .addFilter('type', 'eq', 'VOUCHER')
          .execute()
          .$promise.then(({ data }) => data)
          .then((movements) => ({
            amount: movements.reduce(
              (acc, movement) => acc + movement.amount?.value,
              0.0,
            ),
            movements,
          }))
          .then(({ amount, movements }) =>
            movements[0]?.amount?.text.replace(
              movements[0]?.amount?.value,
              amount,
            ),
          ),
      breadcrumb: /* @ngInject */ (balanceName) => balanceName,
    },
  });

  $urlServiceProvider.rules.when(
    '/billing/payment/credits/movements/:name',
    '/billing/payment/credits/:name',
  );
});
