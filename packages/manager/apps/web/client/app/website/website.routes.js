angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.website', {
    url: '/website/configuration',
    templateUrl: 'website/configuration.html',
    controller: 'WebSiteConfigurationCtrl',
    controllerAs: 'webSiteConfigurationCtrl',
    reloadOnSearch: false,
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation = 'website'; // eslint-disable-line no-param-reassign

          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
      currentSection: () => 'website',
    },
    translations: { value: ['../domain', '../hosting', '../website'], format: 'json' },
  });

  $stateProvider.state('app.website-success', {
    url: '/website/configuration/:domain/:hosting/success/:type',
    templateUrl: 'website/success/success.html',
    controller: 'WebSiteSuccessCtrl',
    controllerAs: 'webSiteSuccessCtrl',
    reloadOnSearch: false,
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation = 'website'; // eslint-disable-line no-param-reassign

          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
      currentSection: () => 'website',
    },
    translations: { value: ['../domain', '../hosting', '../website'], format: 'json' },
  });
});
