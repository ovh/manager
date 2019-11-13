import controller from './billing-order-tracking.controller';
import template from './billing-order-tracking.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.order', {
    url: '/order/:orderId',
    params: {
      ordersFilter: {
        value: '',
      },
    },
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      available: /* @ngInject */ ($state, billingFeatureAvailability) => {
        if (!billingFeatureAvailability.allowOrderTracking()) {
          $state.go('app.account.billing.orders');
        }
      },
      ordersFilter: /* @ngInject */ $transition$ => $transition$.params().ordersFilter,
      goToOrders: /* @ngInject */ ($state, ordersFilter) => () => $state.go('app.account.billing.orders', { filter: ordersFilter }),
    },
  });
};
