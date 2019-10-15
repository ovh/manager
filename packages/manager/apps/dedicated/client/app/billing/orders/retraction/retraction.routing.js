import template from './billing-orders-retraction.html';

export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  $stateProvider.state('app.account.billing.orders.retract', {
    url: '/retract/:id',
    template,
    controller: 'Billing.controllers.OrderRetractionCtrl',
    controllerAs: 'ctrl',
    translations: { value: ['../../..'], format: 'json' },
  });

  $urlServiceProvider.rules.when('/billing/orders/:id/retract', '/billing/orders/retract/:id');
};
