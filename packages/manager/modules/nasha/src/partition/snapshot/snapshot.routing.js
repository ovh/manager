export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('nasha.nasha-partitions.snapshot', {
    url: '/snapshot',
    views: {
      modal: {
        component: 'nashaPartitionSnapshotComponent',
      },
    },
    layout: 'modal',
  });
};
