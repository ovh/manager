

angular.module('managerApp')
  .config(($stateProvider) => {
    $stateProvider
      .state('paas.nasha.nasha-partitions', {
        url: '/partitions',
        views: {
          nashaPartition: {
            templateUrl: 'app/nasha/partition/nasha-partition.html',
            controller: 'PartitionCtrl',
            controllerAs: 'PartitionCtrl',
          },
        },
        onEnter: CucCloudMessage => CucCloudMessage.flushMessages(),
        translations: {
          value: [
            '../../common',
            '.',
            './add',
            './delete',
            './update',
            './snapshot',
            './custom-snapshot',
            './zfs-options',
          ],
          format: 'json',
        },
      });
  });
