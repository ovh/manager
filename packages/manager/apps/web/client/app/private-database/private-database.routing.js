export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database', {
    url: '/configuration/private_database/:productId',
    templateUrl: 'private-database/private-database.html',
    controller: 'PrivateDatabaseCtrl',
    reloadOnSearch: false,
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'private_database';
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    translations: {
      value: ['../private-database', '../hosting'],
      format: 'json',
    },
  });

  $stateProvider.state('app.private-database-order', {
    url: '/configuration/private_database',
    templateUrl: 'private-database/order/private-database-order.html',
    controller: 'PrivateDatabaseOrderCtrl',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'private_database';
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    translations: { value: ['../private-database'], format: 'json' },
  });

  $stateProvider.state('app.sql-order', {
    redirectTo: 'app.private-database-order-clouddb',
    url: '/configuration/sql_order',
  });
};
