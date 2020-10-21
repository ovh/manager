import template from './billing-payments.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.main.payments', {
    url: '/payments',
    template,
    controller: 'Billing.PaymentsCtrl',
    controllerAs: '$ctrl',
  });
};
