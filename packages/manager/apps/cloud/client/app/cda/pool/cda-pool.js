angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('paas.cda.cda-details.cda-pool', {
    url: '/pool',
    views: {
      cdaDetailsTab: {
        templateUrl: 'app/cda/pool/cda-pool.html',
        abstract: true,
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
});
