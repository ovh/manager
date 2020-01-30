import template from './billing-orders-retraction.html';
import controller from './billing-orders-retraction.controller';

export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  $stateProvider.state('app.account.billing.retract', {
    url: '/orders/retract/:id',
    template,
    controller,
    controllerAs: '$ctrl',
    translations: { value: ['../../..'], format: 'json' },
    resolve: {
      orderId: /* @ngInject */ ($transition$) => $transition$.params().id,
    },
  });

  $urlServiceProvider.rules.when(
    '/billing/orders/:id/retract',
    '/billing/orders/retract/:id',
  );
};
