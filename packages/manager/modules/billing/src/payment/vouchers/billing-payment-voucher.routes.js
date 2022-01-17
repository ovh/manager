import controller from './billing-vouchers.controller';
import template from './billing-vouchers.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.payment.vouchers';

  $stateProvider.state(name, {
    url: '/vouchers',
    template,
    controller,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_vouchers'),
    },
  });
};
