import template from './billing-main-history-debt-details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.main.history.debt.details', {
    url: '/details',
    template,
    controller: 'BillingHistoryDebtDetailsCtrl',
    controllerAs: '$ctrl',
    translations: { value: ['.'], format: 'json' },
  });
};
