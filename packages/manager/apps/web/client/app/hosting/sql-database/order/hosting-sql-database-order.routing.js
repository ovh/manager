export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.sql-database.order', {
    url: '/order?orderType&currentHosting',
    params: {
      currentHosting: { value: null, squash: true },
      orderType: { value: 'private' },
    },
    component: 'hostingSqlDatabaseOrder',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation = 'private_database'; // eslint-disable-line no-param-reassign
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
  });
};
