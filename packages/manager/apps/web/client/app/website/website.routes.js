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
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'website';

          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
      currentSection: () => 'website',
    },
    translations: {
      value: ['../domain', '../hosting', '../website'],
      format: 'json',
    },
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
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'website';

          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
      currentSection: () => 'website',
    },
    translations: {
      value: ['../domain', '../hosting', '../website'],
      format: 'json',
    },
  });
});
