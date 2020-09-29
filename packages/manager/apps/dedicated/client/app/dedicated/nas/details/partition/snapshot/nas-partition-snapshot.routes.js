angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated-nas.details.partition.snapshot', {
    url: '/:partitionName/snapshot',
    templateUrl:
      'dedicated/nas/details/partition/snapshot/nas-partition-snapshot.html',
    controller: 'NasPartitionSnapshotCtrl',
    controllerAs: '$ctrl',
    reloadOnSearch: false,
  });
});
