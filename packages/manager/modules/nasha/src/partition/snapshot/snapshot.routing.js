export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.nasha-partitions.snapshot', {
    url: '/snapshot',
    views: {
      modal: {
        component: 'nashaPartitionSnapshotComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
