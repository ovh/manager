angular
  .module('Billing')
  .config(($stateProvider) => {
    $stateProvider.state('app.account.billing.main.payments', {
      url: '/payments',
      templateUrl: 'billing/main/payments/billing-payments.html',
      controller: 'Billing.PaymentsCtrl',
      controllerAs: '$ctrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_main_payments_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
