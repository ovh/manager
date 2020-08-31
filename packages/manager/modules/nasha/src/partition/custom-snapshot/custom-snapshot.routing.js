export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.nasha-partitions.custom-snapshot', {
    url: '/custom-snapshot',
    views: {
      modal: {
        component: 'nashaPartitionCustomSnapshotComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
