

angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('paas.nasha.nasha-partition-access', {
        url: '/access/:partitionName',
        views: {
          nashaPartitionAccess: {
            templateUrl: 'app/nasha/partition/access/nasha-partition-access.html',
            controller: 'NashaPartitionAccessCtrl',
            controllerAs: 'NashaPartitionAccessCtrl',
          },
        },
        translations: {
          value: ['../../../common', '.'],
          format: 'json',
        },
      });
  });
