export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partitions.partition.zfs-options', {
    url: '/zfs-options',
    component: 'nashaComponentsPartitionZfsOptions',
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: 'nasha::dashboard::nasha-partitions::zfs-options',
    },
  });
};
