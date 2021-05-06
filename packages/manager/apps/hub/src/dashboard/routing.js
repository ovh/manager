import { filter, get, groupBy, map, reverse, sortBy } from 'lodash-es';

const getProducts = (services, order, catalog) => {
  return get(services, 'data.count') === 0 && !order
    ? groupBy(
        filter(catalog.data, ({ highlight }) => highlight),
        'universe',
      )
    : reverse(
        sortBy(
          map(services.data?.data, (service, productType) => ({
            ...service,
            productType,
          })),
          'count',
        ),
      );
};

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.dashboard', {
    url: '/?expand',
    params: {
      expand: {
        value: null,
        squash: true,
        dynamic: true,
      },
    },
    resolve: {
      services: /* @ngInject */ ($http) =>
        $http
          .get('/hub/services', {
            serviceType: 'aapi',
          })
          .then((data) => data.data.data.services),
      catalog: /* @ngInject */ ($http) =>
        $http
          .get('/hub/catalog', {
            serviceType: 'aapi',
          })
          .then((data) => data.data.data.catalog),
      products: /* @ngInject */ ($http, order, services, catalog) =>
        getProducts(services, order, catalog),
      trackingPrefix: () => 'hub::dashboard',
      expandProducts: /* @ngInject */ ($state) => (expand) =>
        $state.go('.', {
          expand,
        }),
      expand: /* @ngInject */ ($transition$) => $transition$.params().expand,
      hideBreadcrumb: () => true,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('manager_hub_dashboard'),
    },
    resolvePolicy: {
      async: 'NOWAIT',
    },
    componentProvider: /* @ngInject */ (order, numberOfServices) => {
      return !numberOfServices && !order ? 'hubOrderDashboard' : 'hubDashboard';
    },
  });

  $urlRouterProvider.otherwise('/');
};
