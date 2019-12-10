export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('nasha.nasha-partitions.custom-snapshot', {
    url: '/custom-snapshot',
    views: {
      modal: {
        component: 'nashaPartitionCustomSnapshotComponent',
      },
    },
    layout: 'modal',
  });
};
