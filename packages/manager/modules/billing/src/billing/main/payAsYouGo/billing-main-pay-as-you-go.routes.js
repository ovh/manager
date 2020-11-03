import template from './billing-main-pay-as-you-go.html';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (coreConfigProvider.getRegion() === 'US') {
    $stateProvider.state('app.account.billing.main.pay-as-you-go', {
      url: '/payAsYouGo',
      controller: 'BillingMainPayAsYouGoCtrl',
      controllerAs: '$ctrl',
      template,
      translations: { value: ['.'], format: 'json' },
    });
  }
};
