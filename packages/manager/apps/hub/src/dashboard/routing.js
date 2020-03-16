import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.dashboard', {
    url: '/',
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
    },
    componentProvider: /* @ngInject */ (services) =>
      get(services, 'data.count') === 0 ? 'hubOrderDashboard' : 'hubDashboard',
  });

  $urlRouterProvider.otherwise('/');
};
