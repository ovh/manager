import controller from './billing-vouchers-movements.controller';
import template from './billing-vouchers-movements.html';

export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  const name = 'app.account.billing.payment.vouchers.movement';

  $stateProvider.state(name, {
    url: '/:voucherAccountId',
    template,
    controller,
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
};
