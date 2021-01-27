import controller from './billing-payment-transactions.controller';
import template from './billing-payment-transactions.html';

export default /* @ngInject */ (
  $stateProvider,
  $urlRouterProvider,
  coreConfigProvider,
) => {
  if (coreConfigProvider.getRegion() === 'EU') {
    const name = 'app.account.billing.payment.transactions';

    $stateProvider.state(name, {
      url: '/transactions',
      template,
      controller,
      controllerAs: '$ctrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_payment_transactions_title'),
      },
    });
  }
};
