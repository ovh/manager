angular.module('Billing').config([
  '$stateProvider',
  '$urlRouterProvider',
  'coreConfigProvider',
  ($stateProvider, $urlRouterProvider, coreConfigProvider) => {
    if (
      coreConfigProvider.getRegion() === 'EU' ||
      coreConfigProvider.getRegion() === 'CA'
    ) {
      const name = 'app.account.billing.payment.ovhaccount';

      $stateProvider.state(name, {
        url: '/ovhaccount',
        templateUrl: 'billing/payment/ovhAccount/billing-ovhAccount.html',
        controller: 'Billing.controllers.OvhAccount',
      });

      $urlRouterProvider.when(/^\/billing\/ovhaccount/, ($location, $state) =>
        $state.go(name),
      );
    }
  },
]);
