import template from './billing-payment.html';
import controller from './billing-payment.controller';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.billing.payment';

  $stateProvider.state(name, {
    url: '/payment',
    static: true,
    template,
    controller,
    controllerAs: '$ctrl',
    redirectTo: `${name}.method`,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_title'),
    },
  });
};
