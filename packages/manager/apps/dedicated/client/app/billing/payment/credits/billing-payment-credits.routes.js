angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.credits';

    $stateProvider.state(name, {
      url: '/credits',
      templateUrl: 'billing/payment/credits/billing-credits.html',
      controller: 'Billing.controllers.Credits',
      controllerAs: '$ctrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_payment_credits'),
      },
    });

    $urlRouterProvider.when(/^\/billing\/credits/, ($location, $state) =>
      $state.go(name),
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
