angular.module('App').config(($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-nas.details.partition.dashboard.snapshot',
    {
      url: '/snapshot',
      templateUrl:
        'dedicated/nas/details/partition/snapshot/nas-partition-snapshot.html',
      controller: 'NasPartitionSnapshotCtrl',
      controllerAs: '$ctrl',
      reloadOnSearch: false,
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('nas_details_partition_snapshot'),
      },
    },
  );
});
