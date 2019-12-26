angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('paas.cda.cda-details.cda-ip.cda-ip-list', {
    url: '/list',
    views: {
      cdaIpContent: {
        templateUrl: 'app/cda/ip/list/cda-ip-list.html',
        controller: 'CdaIpListCtrl',
        controllerAs: 'CdaIpListCtrl',
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
});
