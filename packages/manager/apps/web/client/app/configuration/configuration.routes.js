angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.configuration', {
    url: '/configuration',
    component: 'configuration',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation = ''; // eslint-disable-line no-param-reassign
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
  });
});
