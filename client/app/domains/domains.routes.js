angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.domain.all', {
    url: '/configuration/domains',
    component: 'domains',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation = 'domains'; // eslint-disable-line no-param-reassign
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    translations: { value: ['../domain', '../domains'], format: 'json' },
  });
});
