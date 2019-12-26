angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('paas.cda.cda-details.cda-pool.cda-pool-list', {
    url: '/list',
    views: {
      cdaPoolContent: {
        templateUrl: 'app/cda/pool/list/cda-pool-list.html',
        controller: 'CdaPoolListCtrl',
        controllerAs: 'CdaPoolListCtrl',
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
});
