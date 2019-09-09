angular.module('Billing').config(($stateProvider) => {
  $stateProvider.state('app.account.billing.main.history', {
    url: '/history',
    templateUrl: 'account/billing/main/history/billing-main-history.html',
    controller: 'BillingMainHistoryCtrl',
    controllerAs: '$ctrl',
    translations: {
      value: [
        '../history',
        './postalMailOptions',
      ],
      format: 'json',
    },
  });
});
