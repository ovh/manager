angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('paas.cda.cda-details.cda-ip', {
    url: '/ip',
    views: {
      cdaDetailsTab: {
        templateUrl: 'app/cda/ip/cda-ip.html',
        abstract: true,
      },
    },
  });
});
