import template from './billing-payments-request.html';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (coreConfigProvider.getRegion() === 'US') {
    $stateProvider.state('app.account.billing.main.payments.request', {
      url: '/request',
      template,
      controller: 'BillingHistoryRequestCtrl',
      controllerAs: '$ctrl',
      translations: { value: ['../request'], format: 'json' },
    });
  }
};
