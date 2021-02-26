angular
  .module('Billing')
  .config(
    /* @ngInject */
    ($stateProvider, $urlRouterProvider, coreConfigProvider) => {
      if (coreConfigProvider.isRegion('EU')) {
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
  )
  .run(/* @ngTranslationsInject:json ./translations */);
