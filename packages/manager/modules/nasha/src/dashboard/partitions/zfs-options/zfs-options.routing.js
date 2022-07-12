export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partitions.partition.zfs-options', {
    url: '/zfs-options',
    component: 'nashaComponentsPartitionZfsOptions',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
