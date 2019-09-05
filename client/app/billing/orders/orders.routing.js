import template from './billing-orders.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.orders', {
    url: '/orders',
    template,
    controller: 'Billing.controllers.Orders',
    translations: { value: ['..'], format: 'json' },
  });
};
