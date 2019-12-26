angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.domain.all', {
    url: '/configuration/domains',
    component: 'domains',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'domains';
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
