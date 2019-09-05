angular.module('Billing').config(($stateProvider) => {
  $stateProvider.state('app.account.billing.main', {
    url: '',
    templateUrl: 'account/billing/main/billing-main.html',
    controller: 'BillingMainCtrl',
    controllerAs: '$ctrl',
    abstract: true,
    translations: { value: ['../main'], format: 'json' },
  });
});
