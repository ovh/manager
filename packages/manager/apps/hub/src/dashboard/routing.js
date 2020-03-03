import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.dashboard', {
    url: '/',
    resolve: {
      products: /* @ngInject */ (catalog) =>
        groupBy(
          filter(catalog.data, ({ highlight }) => highlight),
          'universe',
        ),

      goToProductPage: /* @ngInject */ ($state) => (product) =>
        $state.go('app.dashboard.products', {
          product: product.toLowerCase(),
        }),
    },
    componentProvider: /* @ngInject */ (services) =>
      services.count === 0 ? 'hubOrderDashboard' : 'hubDashboard',
  });

  $urlRouterProvider.otherwise('/');
};
