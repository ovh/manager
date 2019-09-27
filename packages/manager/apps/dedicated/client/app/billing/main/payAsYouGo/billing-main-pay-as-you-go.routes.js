angular.module('App').config(($stateProvider, coreConfigProvider) => {
  if (coreConfigProvider.getRegion() === 'US') {
    $stateProvider.state('app.account.billing.main.pay-as-you-go', {
      url: '/payAsYouGo',
      controller: 'BillingMainPayAsYouGoCtrl',
      controllerAs: '$ctrl',
      templateUrl: 'billing/main/payAsYouGo/billing-main-pay-as-you-go.html',
      translations: { value: ['.'], format: 'json' },
    });
  }
});
