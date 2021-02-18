angular.module('App').config(($stateProvider, coreConfigProvider) => {
  if (coreConfigProvider.getRegion() === 'US') {
    $stateProvider.state('app.account.billing.main.history.balance', {
      url: '/balance',
      templateUrl: 'billing/main/history/balance/billing-history-balance.html',
      controller: 'BillingHistoryBalanceCtrl',
      controllerAs: '$ctrl',
      translations: { value: ['../balance'], format: 'json' },
    });
  }
});
