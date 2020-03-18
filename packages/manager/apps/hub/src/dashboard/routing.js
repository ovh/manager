import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';

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
      products: /* @ngInject */ (catalog, services) =>
        get(services, 'data.count') === 0
          ? groupBy(
              filter(catalog.data, ({ highlight }) => highlight),
              'universe',
            )
          : reverse(
              sortBy(
                map(services.data.data, (service, productType) => ({
                  ...service,
                  productType,
                })),
                'count',
              ),
            ),

      goToProductPage: /* @ngInject */ ($state) => (product) =>
        product.includes('EXCHANGE')
          ? $state.go('app.dashboard.exchange')
          : $state.go('app.dashboard.products', {
              product: product.toLowerCase(),
            }),
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
    componentProvider: /* @ngInject */ (order, services) =>
      get(services, 'data.count') === 0 && !order.data
        ? 'hubOrderDashboard'
        : 'hubDashboard',
  });

  $urlRouterProvider.otherwise('/');
};
