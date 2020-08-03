angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('paas.cda.cda-details', {
    url: '/{serviceName}',
    redirectTo: 'paas.cda.cda-details.cda-details-home',
    views: {
      cdaDetails: {
        templateUrl: 'app/cda/details/cda-details.html',
        controller: 'CdaDetailsCtrl',
        controllerAs: 'CdaDetailsCtrl',
      },
    },
  });
});
