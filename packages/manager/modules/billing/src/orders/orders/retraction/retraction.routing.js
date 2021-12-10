import template from './billing-orders-retraction.html';
import controller from './billing-orders-retraction.controller';

export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  $stateProvider.state('app.account.billing.orders.order.retract', {
    url: '/retract',
    template,
    controller,
    controllerAs: '$ctrl',
    translations: { value: ['../../..'], format: 'json' },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_orders_retractation'),
    },
  });

  $urlServiceProvider.rules.when(
    '/billing/orders/retract/:id',
    '/billing/orders/:id/retract',
  );
};
