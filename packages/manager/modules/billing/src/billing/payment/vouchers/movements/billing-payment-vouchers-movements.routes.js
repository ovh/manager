import template from './billing-vouchers-movements.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.payment.vouchers.movement';

  $stateProvider.state(name, {
    url: '/movements/:voucherAccountId',
    template,
    controller: 'Billing.controllers.Vouchers.Movements',
  });
};
