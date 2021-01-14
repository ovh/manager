angular
  .module('Billing')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'coreConfigProvider',
    ($stateProvider, $urlRouterProvider, coreConfigProvider) => {
      if (coreConfigProvider.getRegion() === 'EU') {
        const name = 'app.account.billing.payment.fidelity';

        $stateProvider.state(name, {
          url: '/fidelity',
          templateUrl: 'billing/payment/fidelity/billing-fidelity.html',
          controller: 'Billing.controllers.Fidelity',
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('billing_payment_fidelity'),
          },
        });

        $urlRouterProvider.when(/^\/billing\/fidelity/, ($location, $state) =>
          $state.go(name),
        );
      }
    },
  ])
  .run(/* @ngTranslationsInject:json ./translations */);
