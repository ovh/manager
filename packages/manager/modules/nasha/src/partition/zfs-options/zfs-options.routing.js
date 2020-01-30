export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.nasha-partitions.zfs-options', {
    url: '/zfs-options',
    views: {
      modal: {
        component: 'nashaPartitionZfsOptionsComponent',
      },
    },
    layout: 'modal',
  });
};
