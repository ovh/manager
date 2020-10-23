import template from './billing-sla.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.sla', {
    url: '/sla',
    template,
    controller: 'Billing.controllers.Sla',
    translations: { value: ['..'], format: 'json' },
  });
};
