

angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('paas.nasha', {
        url: '/nasha/:nashaId',
        templateUrl: 'app/nasha/nasha.html',
        controller: 'NashaCtrl',
        controllerAs: 'NashaCtrl',
        abstract: true,
        translations: {
          value: ['../common', '.'],
          format: 'json',
        },
      });
  });
