export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('nasha.nasha-partitions.update', {
    url: '/update',
    views: {
      modal: {
        component: 'nashaPartitionUpdateComponent',
      },
    },
    layout: 'modal',
  });
};
