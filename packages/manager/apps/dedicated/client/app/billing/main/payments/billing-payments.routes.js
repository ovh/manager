angular.module('Billing').config(($stateProvider) => {
  $stateProvider.state('app.account.billing.main.payments', {
    url: '/payments',
    templateUrl: 'billing/main/payments/billing-payments.html',
    controller: 'Billing.PaymentsCtrl',
    controllerAs: '$ctrl',
    translations: { value: ['../payments'], format: 'json' },
  });
});
