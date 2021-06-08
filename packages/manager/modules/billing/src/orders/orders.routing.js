import controller from './billing-orders.controller';
import template from './billing-orders.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.orders', {
    url: '/orders?filter',
    params: {
      filter: {
        dynamic: true,
      },
    },
    template,
    controller,
    controllerAs: '$ctrl',
    translations: { value: ['../'], format: 'json' },
    resolve: {
      orders: /* @ngInject */ (iceberg) =>
        iceberg('/me/order')
          .query()
          .expand('CachedObjectList-Pages')
          .sort('date', 'DESC')
          .limit(5000)
          .execute(null, true)
          .$promise.then(({ data }) => data),
      /* @ngInject */
      timeNow: ($http) =>
        $http
          .get('/auth/time', { serviceType: 'apiv6' })
          .then((result) => parseInt(result.data, 10))
          .then((timestamp) => moment(timestamp)),
      filter: /* @ngInject */ ($transition$) => $transition$.params().filter,
      criteria: /* @ngInject */ ($log, filter) => {
        if (filter) {
          try {
            const criteria = JSON.parse(decodeURIComponent(filter));
            if (!Array.isArray(criteria)) throw new Error('Invalid criteria');
            return criteria;
          } catch (err) {
            $log.error(err);
          }
        }
        return undefined;
      },
      schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,

      getOrderTrackingHref: /* @ngInject */ ($state) => (order, filter) =>
        $state.href('app.account.billing.orders.order', {
          orderId: order.orderId,
          ordersFilter: filter,
        }),

      goToOrder: /* @ngInject */ ($state) => (order, filter) =>
        $state.go('app.account.billing.orders.order', {
          orderId: order.orderId,
          ordersFilter: filter,
        }),

      goToOrderRetractation: /* @ngInject */ ($state) => ({ orderId }) =>
        $state.go('app.account.billing.orders.order.retract', {
          orderId,
        }),
      updateFilterParam: /* @ngInject */ ($state) => (filter) =>
        $state.go(
          'app.account.billing.orders',
          {
            filter,
          },
          {
            reload: false,
          },
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('orders_page_title'),
      hideBreadcrumb: () => true,
    },
  });
};
