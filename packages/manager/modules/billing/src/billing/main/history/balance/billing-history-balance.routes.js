import template from './billing-history-balance.html';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (coreConfigProvider.getRegion() === 'US') {
    $stateProvider.state('app.account.billing.main.history.balance', {
      url: '/balance',
      template,
      controller: 'BillingHistoryBalanceCtrl',
      controllerAs: '$ctrl',
      translations: { value: ['../balance'], format: 'json' },
    });
  }
};
