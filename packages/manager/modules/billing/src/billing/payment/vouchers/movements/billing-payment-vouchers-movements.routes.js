angular.module('Billing').config(($stateProvider) => {
  const name = 'app.account.billing.payment.vouchers.movement';

  $stateProvider.state(name, {
    url: '/movements/:voucherAccountId',
    templateUrl:
      'billing/payment/vouchers/movements/billing-vouchers-movements.html',
    controller: 'Billing.controllers.Vouchers.Movements',
  });
});
