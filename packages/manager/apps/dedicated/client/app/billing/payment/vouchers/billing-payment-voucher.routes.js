angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.vouchers';

    $stateProvider.state(name, {
      url: '/vouchers',
      templateUrl: 'billing/payment/vouchers/billing-vouchers.html',
      controller: 'Billing.controllers.Vouchers',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_payment_vouchers'),
      },
    });

    $urlRouterProvider.when(/^\/billing\/vouchers/, ($location, $state) =>
      $state.go(name),
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
