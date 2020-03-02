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
    },
    componentProvider: /* @ngInject */ (services) =>
      services.count === 0 ? 'hubOrderDashboard' : 'hubDashboard',
  });

  $urlRouterProvider.otherwise('/');
};
