import template from './template.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('nasha.nasha-partitions', {
      url: '/partitions',
      views: {
        nashaPartition: {
          template,
          controller: 'NashaPartitionCtrl',
          controllerAs: 'NashaPartitionCtrl',
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
};
