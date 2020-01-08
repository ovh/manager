angular.module('Billing').config([
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
      });

      $urlRouterProvider.when(/^\/billing\/fidelity/, ($location, $state) =>
        $state.go(name),
      );
    }
  },
]);
