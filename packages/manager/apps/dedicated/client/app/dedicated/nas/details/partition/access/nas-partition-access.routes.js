angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated-nas.details.partition.access', {
    url: '/:partitionName/access',
    templateUrl:
      'dedicated/nas/details/partition/access/nas-partition-access.html',
    controller: 'NasPartitionAccessCtrl',
    controllerAs: '$ctrl',
    reloadOnSearch: false,
  });
});
