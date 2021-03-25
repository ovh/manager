export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.nasha-partitions.zfs-options', {
    url: '/zfs-options',
    views: {
      modal: {
        component: 'nashaPartitionZfsOptionsComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
