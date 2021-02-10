angular.module('Billing').config(($stateProvider, $urlServiceProvider) => {
  const name = 'app.account.billing.payment.vouchers.movement';

  $stateProvider.state(name, {
    url: '/:voucherAccountId',
    templateUrl:
      'billing/payment/vouchers/movements/billing-vouchers-movements.html',
    controller: 'Billing.controllers.Vouchers.Movements',
    resolve: {
      voucherAccountId: /* @ngInject */ ($transition$) =>
        $transition$.params().voucherAccountId,
      breadcrumb: /* @ngInject */ (voucherAccountId) => voucherAccountId,
    },
  });

  $urlServiceProvider.rules.when(
    '/billing/payment/vouchers/movements/:name',
    '/billing/payment/vouchers/:name',
  );
});
