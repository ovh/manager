angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.domain.dns-zone', {
    url: '/configuration/zone/:productId?tab',
    templateUrl: 'dns-zone/dns-zone.html',
    controller: 'DnsZoneCtrl',
    controllerAs: 'ctrlDomain',
    reloadOnSearch: false,
    params: {
      tab: null,
    },
    resolve: {
      currentSection: () => 'zone',
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation = 'zone'; // eslint-disable-line no-param-reassign
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    translations: { value: ['../domain'], format: 'json' },
  });

  $stateProvider.state('app.dns-zone-new', {
    url: '/configuration/new_dns_zone',
    templateUrl: 'dns-zone/new/dns-zone-new.html',
    controller: 'newDnsZoneCtrl',
    controllerAs: 'ctrlNewDnsZone',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          $rootScope.currentSectionInformation = 'newDnsZone'; // eslint-disable-line no-param-reassign
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    translations: { value: ['.', '../domains'], format: 'json' },
  });
});
