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
      controller: 'BillingPaymentTransactionsCtrl',
      controllerAs: '$ctrl',
      translations: { value: ['./'], format: 'json' },
    });
  }
};
