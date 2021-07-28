import controller from './billing-order-tracking.controller';
import template from './billing-order-tracking.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.orders.order', {
    url: '/:orderId',
    params: {
      ordersFilter: {
        value: '',
      },
    },
    template,
    controller,
    controllerAs: '$ctrl',
    atInternet: {
      ignore: true, // this to tell AtInternet to not track this state
    },
    resolve: {
      available: /* @ngInject */ ($state, billingFeatureAvailability) => {
        if (!billingFeatureAvailability.allowOrderTracking()) {
          $state.go('app.account.billing.orders');
        }
      },
      ordersFilter: /* @ngInject */ ($transition$) =>
        $transition$.params().ordersFilter,
      goToOrders: /* @ngInject */ ($state, ordersFilter) => () =>
        $state.go('app.account.billing.orders', {
          filter: ordersFilter,
        }),
      orderId: /* @ngInject */ ($transition$) => $transition$.params().orderId,
      breadcrumb: /* @ngInject */ (orderId) => orderId,
    },
  });
};
