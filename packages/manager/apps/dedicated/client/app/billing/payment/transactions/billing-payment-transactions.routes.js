angular
  .module('Billing')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'coreConfigProvider',
    ($stateProvider, $urlRouterProvider, coreConfigProvider) => {
      if (coreConfigProvider.getRegion() === 'EU') {
        const name = 'app.account.billing.payment.transactions';

        $stateProvider.state(name, {
          url: '/transactions',
          templateUrl:
            'billing/payment/transactions/billing-payment-transactions.html',
          controller: 'BillingPaymentTransactionsCtrl',
          controllerAs: '$ctrl',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('billing_payment_transactions_title'),
          },
        });
      }
    },
  ])
  .run(/* @ngTranslationsInject:json ./translations */);
