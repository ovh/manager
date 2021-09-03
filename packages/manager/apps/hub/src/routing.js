import { mapValues, head } from 'lodash-es';

const parseErrors = (data) =>
  mapValues(data.data, (value) =>
    value.status === 'ERROR'
      ? {
          status: value.status,
          error: value.data,
        }
      : value,
  );

const transformOrder = ($q, lastOrder, OrderTracking) => {
  const latestOrder = lastOrder.data;
  return latestOrder
    ? $q
        .all({
          status: OrderTracking.getOrderStatus(latestOrder),
          details: OrderTracking.getOrderDetails(latestOrder),
        })
        .then(({ status, details }) => ({
          ...latestOrder,
          status,
          ...head(details),
        }))
        .then((order) =>
          OrderTracking.getCompleteHistory(order).then((history) => ({
            ...order,
            ...history,
          })),
        )
    : $q.resolve();
};

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '',
    abstract: true,
    redirectTo: 'app.dashboard',
    resolve: {
      sidebar: /* @ngInject */ ($rootScope) => {
        $rootScope.$broadcast('sidebar:loaded');
      },
      order: /* @ngInject */ ($q, $http, OrderTracking) =>
        $http
          .get('/hub/lastOrder', { serviceType: 'aapi' })
          .then((data) =>
            transformOrder($q, data.data.data.lastOrder, OrderTracking),
          ),
      numberOfServices: /* @ngInject */ ($http) =>
        $http
          .get('/services', {
            headers: {
              'X-Pagination-Mode': 'CachedObjectList-Pages',
              'X-Pagination-Size': 5,
            },
          })
          .then((data) => data.data.length),
      trackingPrefix: () => 'hub::dashboard::activity::payment-status',
      refresh: /* @ngInject */ ($http) => (type) =>
        $http
          .get(`/hub/${type}`, {
            serviceType: 'aapi',
          })
          .then(({ data }) => parseErrors(data)),
    },
  });

  $urlRouterProvider.otherwise('/');
};
