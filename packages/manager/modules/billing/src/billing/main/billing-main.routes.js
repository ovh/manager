import template from './billing-main.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.main', {
    url: '',
    template,
    controller: 'BillingMainCtrl',
    controllerAs: '$ctrl',
    abstract: true,
    translations: { value: ['../main'], format: 'json' },
  });
};
